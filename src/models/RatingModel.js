const { default: mongoose } = require("mongoose");

const RatingSchema = new mongoose.Schema({
    star:{type:Number,required:true,min:0,max:5},
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

const RatingModel = mongoose.model('ratings',RatingSchema)
module.exports = RatingModel