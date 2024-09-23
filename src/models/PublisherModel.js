const { default: mongoose } = require("mongoose");

const PublisherSchema = new mongoose.Schema({
    name:{type:String,required:true},
},
{
    timestamps: true
}
)

const PublisherModel = mongoose.model('publishers',PublisherSchema)
module.exports = PublisherModel