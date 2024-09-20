const { default: mongoose } = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    content:{type:String,required:true},
    isRead:{type:Boolean,default:false},
    isViewed:{type:Boolean,default:false},
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
},
{
    timestamps: true
}
)

const NotificationModel = mongoose.model('notifications',NotificationSchema)
module.exports = NotificationModel