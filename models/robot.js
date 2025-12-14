// models/robot.js

const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema(
  {
    robotName: {
      type: String,
      required: true,
    },
    mobility: {
      type: String  ,   
      enum: ['Fixed','Mobile'],
    },
    discription: {
        type: String, //textarea
      required: false,
    },
    robotImage: {
      type: String,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;
