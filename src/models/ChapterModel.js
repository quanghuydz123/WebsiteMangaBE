const { default: mongoose } = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    idManga:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manga',
        required:true
    },
    title:{type:String,required:true},
    isDeleted:{type:Boolean,default:false},
    imageLinks:[{
        imageLink:{type:String},
        index:{type:Number}
    }]
},
{
    timestamps: true
}
)

const ChapterModel = mongoose.model('chapters',ChapterSchema)
module.exports = ChapterModel