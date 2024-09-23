const { default: mongoose } = require("mongoose");

const PublisherSchema = new mongoose.Schema({
    name:{type:String,required:true},
    isDeleted:{type:Boolean,default:false},

},
{
    timestamps: true
}
)

const PublisherModel = mongoose.model('publishers',PublisherSchema)
module.exports = PublisherModel