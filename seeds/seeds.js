
const User = require("../models/user.model")
const Exhibition = require("../models/exhibition.model")
const mongoose = require("mongoose");



// Password for Vanya Mark -> DiogoBarros1 (admin)

const users = [
  { username: "Vanya Mark", email: "vanya.mark@ironhack.com", passwordHash:"$2a$10$LZ8XiLY1melVKdAr.E/WreBSaO.W66uclyIuH3.7CgKqUhdP7FDua", role: "admin" }  
]

  const exhibitions = [{ "id": '1a', "exhibitionName": "Fine Art of the Week", "artType": 'Fine Art', "week": "Mon-08/01/2024-Sun-14/01/2024"}, 
  
  { "id": '1b', "exhibitionName": "Photography of the Week", "artType": 'Photography', "week": "Mon-08/01/2024-Sun-14/01/2024"},
  
  { "id": '1c', "exhibitionName": "Plastic Art of the Week", "artType": 'Plastic Art', "week": "Mon-08/01/2024-Sun-14/01/2024"},
  
  { "id": '2a', "exhibitionName": "Nature Fine Art", "artType": 'Fine Art', "week": "Mon-15/01/2024-Sun-21/01/2024"}, 

  { "id": '2b', "exhibitionName": "Nature Photography", "artType": 'Photography', "week": "Mon-15/01/2024-Sun-21/01/2024"}, 

  { "id": '2c', "exhibitionName": "Nature Plastic Art", "artType": 'Photography', "week": "Mon-15/01/2024-Sun-21/01/2024"}, 
  
  { "id": '3a', "exhibitionName": "Dry January Fine Art", "artType": 'Fine Art', "week": "Mon-22/01/2024-Sun-28/01/2024"},

  { "id": '3b', "exhibitionName": "Dry January Photography", "artType": 'Photography', "week": "Mon-22/01/2024-Sun-28/01/2024"},
  
  { "id": '3c', "exhibitionName": "Dry January Plastic Art", "artType": 'Plastic Art', "week": "Mon-22/01/2024-Sun-28/01/2024"}]
  
  const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/CRUD-art-event-app";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

   Exhibition.create(exhibitions)
      .then(data => {

        console.log(`${data.length} Exhibitions inserted.`)
        mongoose.connection.close()

      }).catch((err) => {
        console.error("Error creating exhibitions: ", err);
      });

    User.create(users)
      .then(data => {

        console.log(`${data.length} users inserted.`)
        mongoose.connection.close()

      }).catch((err) => {
        console.error("Error creating users: ", err);
      });

  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });