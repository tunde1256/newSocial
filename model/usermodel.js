// const mongoose = require('mongoose');
// require('dotenv').config();

// const PostSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//     ref: 'User'
//   },
//   email:{
//     type:String,
//     required:true,
//     unique:true,
//     match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//   },
//   desc: {
//     type: String,
//     max: 5000
//   },
//   img: {
//     type: String
//   },
//   likes: {
//     type: Array,
//     default: []
//   },
//   dislikes: {
//     type: Array,
//     default: []
//   },
//   comments: {
//     type: Array,
//     default: []
//   },
//   mentions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('Post', PostSchema);
