const { default: mongoose } = require("mongoose");

const MangaSchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    summary:{type:String},
    imageUrl:{type:String},
    idAuthor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authors',
    }],
    idPublisher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publishers',
    },
    genres:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genres',
        required: true,
    }],
    views:{type:Number,default:0},
    isDeleted:{type:Boolean,default:false},
    publish_date:{type:Date},
    status:{type:Number},

},
{
    timestamps: true
}
)

const MangaModel = mongoose.model('manga',MangaSchema)
module.exports = MangaModel