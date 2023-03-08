const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    favourites: {
      type: Schema.Types.ObjectId, ref:"Artwork"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
