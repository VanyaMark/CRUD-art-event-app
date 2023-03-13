const { Schema, model } = require("mongoose");

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
    artist: {
    },
    ranking: {
      type: Number,
    }
  },
  {
    timestamps: true
  }
);

const Artwork = model("Artwork", artworkSchema);

module.exports = Artwork;