const multer = require('multer');
const { validateBlogPostSchema } = require('../utils/validator');
const { NODE_ENV } = require('../config');
const ErrorHandler = require('../middlewares/ErrorHandler');
const fs = require('fs');
const path = require('path');
const { Blog } = require('../models');
const { ALREADY_EXISTS, CREATED_SUCCESS, WRONG_CREDENTIALS, LOGIN_SUCCESS, NOT_FOUND, UNAUTHENTICATED, PASSWORD_CHANGED, SERVER_ERROR } = require('../constant');
const { v4: uuidv4 } = require('uuid');
const { MongooseError } = require('mongoose');

const createBlog = async (req, res, next) => {
   let fileName = null

   const storage = multer.diskStorage({
      destination: function (req, file, cb) {
         cb(null, 'public/uploads');
      },
      filename: function (req, file, cb) {
         fileName = uuidv4() + path.extname(file.originalname);
         cb(null, fileName);
      }
   });

   var upload = multer({
      storage: storage, limits: { fileSize: 1500000 },
      fileFilter: function (req, file, cb) {
         var filetypes = /jpeg|jpg|png|webp/;
         var mimetype = filetypes.test(file.mimetype);
         var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());
         if (mimetype && extname) {
            return cb(null, true);
         }
         cb("Error: File upload only supports jpeg|jpg|png|webp");
      }
   }).single("post_image");

   upload(req, res, async function (err) {
      try {
         if (err) {
            return res.status(404).json({ status: 400, message: err })
         }
         if (!req.file) {
            return res.status(404).json({ status: 400, message: "Post image is required" })
         } else {
            const error = validateBlogPostSchema(req.body)
            if (error?.details) {
               fs.unlinkSync('public/uploads/' + fileName)
               const err = NODE_ENV !== 'production' ? error?.details : error?.details[0]?.message
               return next(new ErrorHandler(401, err))
            }
            try {
               req.file.filename = fileName;
               const slug = req.body.title.toLowerCase().split(' ').join('-').trim();
               const blog = await Blog.create({
                  ...req.body,
                  slug,
                  author: req.user._id,
                  post_image: fileName
               })
               if (blog) {
                  return res.status(200).json({ status: CREATED_SUCCESS.statusCode, message: "Post " + CREATED_SUCCESS.message })
               }
               return next(ErrorHandler.serverError())
            } catch (err) {
               if (fs.existsSync('public/uploads/' + fileName)) {
                  fs.unlinkSync('public/uploads/' + fileName)
               }
               if (err.code === 11000) return next(ErrorHandler.unCaughtError(400, "Post title already exists, Can't create duplicate post title!"))
               return next(ErrorHandler.unCaughtError(400, err.code))
            }
         }
      } catch (error) {
         console.log(error);
         res.sendStatus(400);
      }
   })
}





const getBlogPost = async (req, res,next) =>{
   try{
      const blogs = await Blog.find({}).populate('author',['-password','-refreshToken','-createdAt','-updatedAt','-__v']).populate('categoryId').sort({createdAt:-1}).lean().exec();
      return res.status(200).json({ status: 200, blogs })
   }catch(err){
      return next(ErrorHandler.unCaughtError(500, err.code))
   }
}

const getSingleBlogPost = async (req, res,next) =>{
   try{
      const {slug} = req.params
      const blogSingle = await Blog.findOne({'slug':slug}).populate('author',['-password','-refreshToken','-createdAt','-updatedAt','-__v']).populate('categoryId').lean().exec();
      console.log(blogSingle)
      if(blogSingle){
         return res.status(200).json({ status: 200, blogSingle })
      }
      return next(ErrorHandler.notFound())

   }catch(err){
      return next(ErrorHandler.unCaughtError(500, err.code))
   }
}


module.exports = { createBlog,getBlogPost,getSingleBlogPost }