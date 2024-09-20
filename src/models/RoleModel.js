const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name:{type:String,required:true},
},
{
    timestamps: true
}
)

const RoleModel = mongoose.model('roles',RoleSchema)
module.exports = RoleModel