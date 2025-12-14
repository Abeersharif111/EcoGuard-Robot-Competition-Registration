// we need mongoose schema


const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  age:{
    type: Number,
    required: true,
  } ,

  schoolName:{
    type: String,
    required: false,
  }
});


// then we register the model with mongoose
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;
