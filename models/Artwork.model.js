const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const artworkSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    artist: {//refers to Artist Model
    },
    ranking: {
      type: Number,
        //Not sure how to define ranking
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Artwork = model("Artwork", artworkSchema);

module.exports = Artwork;