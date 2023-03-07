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
      default:'-'
    },

    lastName: {
      type: String,
      trim: true,
      default:'-'
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
      default: '-'
    },
    phoneNumber: {
      type:Number,
      default:0000000000
    },
    avatarUrl: {
      type: String,
      default: `-`,
      trim: true
    }, 
    dateOfBirth: {
      type:String,
      default:`-`
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-Binary', 'Rather Not Say','-'],
      default: `-`
    },
    nationality: {
      type:String,
      default:`-`
    },
    exhibitionsHosted:[{
      type: Schema.Types.ObjectId, ref:"Exhibition"
    }],
    exhibitionsAttended:[{
      type: Schema.Types.ObjectId, ref:"Exhibition"
    }],
    favourites: {
      type: Schema.Types.Mixed, ref:"Artwork",
      default: `-`
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
