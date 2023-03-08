const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const artistApplicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, ref:"User"
    },
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
    dateOfBirth: {
        type: String,
        required: true,
    },

    profilePicUrl: {
      type: String,
      required: true,
    },
    address:{
        type:String,
        required: true
      },
      phoneNumber: {
        type:Number,
        required: true
      },
    artworkUrl:{
        type:[String],
        required: true
    },

   artType: {
      type: String,
      enum: ['Fine Art', 'Photography', 'Plastic Art' ],
      required: true
    },

    // message for artist to choose size wisely
    wallSize: {
        type: String,
        enum: ['1m space - €80 per week', '2m space - €120 per week', '3m space - €150 per week' ],
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

const ArtistApplication = model("ArtistApplication", artistApplicationSchema);

module.exports = ArtistApplication;