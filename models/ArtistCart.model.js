const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const artistCartSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },

    profilePicUrl: {
      type: String,
      required: true,
    },
    address:{
        type:String,
        default: '-',
        required: true
      },
      phoneNumber: {
        type:Number,
        default:0000000000,
        required: true
      },
    artworkUrl:{
        type:[String],
        required: true
    },
// message for artist to choose size wisely
    wallSize: {
        type: String,
        enum: ['3m space - €100', '6m space - €200', '9m space - €300' ],
        required: true
    },
   
    description: {
      type: String,
      required: true
    },
    dateRequested: {
        type: String,
        required: true
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const ArtistCart = model("ArtistCart", artistCartSchema);

module.exports = ArtistCart;