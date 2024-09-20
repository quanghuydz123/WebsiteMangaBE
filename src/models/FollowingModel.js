const { default: mongoose } = require("mongoose");

const FollowingSchema = new mongoose.Schema({
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    idManga:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manga',
        required:true
    },
},
{
    timestamps: true
}
)

const FollowingModel = mongoose.model('followings',FollowingSchema)
module.exports = FollowingModel