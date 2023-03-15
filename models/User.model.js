const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['visitor', 'artist', 'admin'],
      required: true
    },
    address:{
      type:String,
    },
    phoneNumber: {
      type:Number,
    },
    avatarUrl: {
      type: String,
      default: '../images/avatar.jpg',
      trim: true
    }, 
    dateOfBirth: {
      type:String, 
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-Binary', 'Rather Not Say'],
    },
    nationality: {
      type:String,  
    },
    exhibitionsHosted:[{
      type: Schema.Types.ObjectId, ref:"Exhibition"
    }],
    exhibitionsAttended:[{
      type: Schema.Types.ObjectId, ref:"Exhibition"
    }],
    favourites: [{
      type: Schema.Types.Mixed,
    }]
  },
  { 
    timestamps: true
  }
);
const User = model("User", userSchema);

module.exports = User;
