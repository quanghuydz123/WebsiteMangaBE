const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    idManga:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manga',
        required:true
    },
    text:{type:String,required:true},
    isDeleted:{type:Boolean,default:false}
},
{
    timestamps: true
}
)

const CommentModel = mongoose.model('comments',CommentSchema)
module.exports = CommentModel