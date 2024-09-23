const { default: mongoose } = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    isDeleted:{type:Boolean,default:false},

},
{
    timestamps: true
}
)

const AuthorModel = mongoose.model('authors',AuthorSchema)
module.exports = AuthorModel