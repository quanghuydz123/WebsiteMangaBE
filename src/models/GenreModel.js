const { default: mongoose } = require("mongoose");

const GenreSchema = new mongoose.Schema({
    name:{type:String,required:true},
    slug:{type:String,required:true},
    isDeleted:{type:Boolean,required:false}
},
{
    timestamps: true
}
)

const GenreModel = mongoose.model('genres',GenreSchema)
module.exports = GenreModel