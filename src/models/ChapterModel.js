const { default: mongoose } = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    manga:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mangas',
        required:true
    },
    title:{type:String,required:true,unique:true},
    isDeleted:{type:Boolean,default:false}, 
    imageLinks:[{
        type: String,
    }],
},
{
    timestamps: true
}
)

const ChapterModel = mongoose.model('chapters',ChapterSchema)
module.exports = ChapterModel