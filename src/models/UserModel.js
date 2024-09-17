const { Double } = require("mongodb");
const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname:{type:String},
    email:{type:String,require:true},
    password:{type:String,require:true},

},
{
    timestamps: true
}
)

const UserModel = mongoose.model('users',UserSchema)
module.exports = UserModel