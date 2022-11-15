var mongoose = require('mongoose');
 exports.validateObjectId =  function(id){
    if(id.length<24){
        return false;
    }
    return mongoose.Types.ObjectId.isValid(id);
}
