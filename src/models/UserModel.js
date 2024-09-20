const { Double } = require("mongodb");
const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName:{type:String},
    email:{type:String,required:true},
    password:{type:String},
    isDeleted:{type:Boolean},
    account_type:{type:String,required:true},
    reading_history:[{
        idChapter:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chapters',
        },
    }],
    idRole:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required:true
    },
},
{
    timestamps: true
}
)

const UserModel = mongoose.model('users',UserSchema)
module.exports = UserModel