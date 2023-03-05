const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const exhibitionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true
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
        //refers to Artist model
    },
    location: {
        type: String
    }
    /* startDate: {},
    endDate: {},
    status: {},
    ranking: {},
    likes: {}, */
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Exhibition = model("Exhibition", exhibitionSchema);

module.exports = Exhibition;