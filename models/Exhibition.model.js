const { Schema, model } = require("mongoose");

const exhibitionSchema = new Schema(
  {
    exhibitionName: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    exhibitionDescription: {
      type: String,
      required: true
    }, 
    artistApplication: [{
      type: Schema.Types.Mixed, ref:"ArtistApplication"
    }],

    usersAttended: [{
      type: Schema.Types.ObjectId, ref:"User"
    }],

    exhibitionWeek: {
      type: String,
      unique: true,
      required: true
    },
    exhibitionStatus: {
      type: String,
      enum: ['open', 'closed', 'cancelled'],
      default: 'open',
    },
    archived: {
      type: Boolean,
      default: false,
    }
  },
  {  
    timestamps: true
  }
);

const Exhibition = model("Exhibition", exhibitionSchema);

module.exports = Exhibition;