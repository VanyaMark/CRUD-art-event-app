const { Schema, model } = require("mongoose");

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
    artworkName: {
      type: String,
      required: true
    },
    artworkUrl:{
        type: String,
        required: true
    },
   artType: {
      type: String,
      enum: ['Fine Art', 'Photography', 'Plastic Art' ],
      required: true
    },
    wallSize: {
        type: String,
        enum: ['1m space - €80 per week', '2m space - €120 per week', '3m space - €150 per week' ],
        required: true
    },
    description: {
      type: String,
      required: true
    },
    chooseWeek: {
        type: String,
        required: true
    },
    applicationStatus: {
      type: String,
      enum: ['approved', 'unapproved', 'to be approved'],
      default: "to be approved"
    },
  },
  {  
    timestamps: true
  }
);
const ArtistApplication = model("ArtistApplication", artistApplicationSchema);

module.exports = ArtistApplication;