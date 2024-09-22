const { default: mongoose } = require("mongoose");

const GenreSchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    slug:{type:String,required:true,unique:true},
    isDeleted:{type:Boolean,default:false}
},
{
    timestamps: true
}
)

const GenreModel = mongoose.model('genres',GenreSchema)
module.exports = GenreModel