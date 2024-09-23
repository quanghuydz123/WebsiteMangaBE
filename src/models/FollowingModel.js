const { default: mongoose } = require("mongoose");

const FollowingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    manga:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mangas',
        required:true
    },
},
{
    timestamps: true
}
)

const FollowingModel = mongoose.model('followings',FollowingSchema)
module.exports = FollowingModel