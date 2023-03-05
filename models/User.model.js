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
    phoneNumber: Number,
    avatarUrl: {
      type: String,
      // default: //add default image for user
    }, 
    //googleId ???
    role: {
      type: String,
      enum: ['visitor', 'artist', 'admin']
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary']
    },
    nationality: String,
    favourites: {
      //should refer to artwork model
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
