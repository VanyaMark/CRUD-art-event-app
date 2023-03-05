
const User = require("../models/user.model")
const mongoose = require("mongoose");


// Password for Vanya Mark -> DiogoBarros1 (admin)

const users = [
  { username: "Vanya Mark", email: "vanya.mark@ironhack.com", passwordHash:"$2a$10$LZ8XiLY1melVKdAr.E/WreBSaO.W66uclyIuH3.7CgKqUhdP7FDua", role: "admin" }
  
]

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/CRUD-art-event-app";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    User.create(users)
      .then(data => {

        console.log(`${data.length} users inserted.`)
        mongoose.connection.close()

      }).catch((err) => {
        console.error("Error creating products: ", err);
      });

  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });