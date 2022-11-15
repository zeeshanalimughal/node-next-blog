const multer = require('multer');
const createBlog = async (req, res, next) => {

    const storage = multer.diskStorage({   
        destination: function(req, file, cb) { 
           cb(null, 'public/uploads');    
        }, 
        filename: function (req, file, cb) { 
           cb(null , file.originalname);   
        }
     });

     var upload = multer({ storage: storage,    limits : {fileSize : 1500000} }).single("post_image");
     
     upload(req, res, function (err) {
         try {
            if(!req.file){
               return res.status(404).json({status:400,message:"Post image is required"})
            }else{
                return res.json(req.file);
            }
          } catch (error) {
            console.log(error);
            res.sendStatus(400);
          }
     })
}


module.exports = {createBlog}