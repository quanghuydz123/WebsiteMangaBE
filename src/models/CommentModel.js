const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    manga:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mangas',
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