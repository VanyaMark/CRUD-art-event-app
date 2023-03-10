
const User = require("../models/user.model")
const Exhibition = require("../models/exhibition.model")
const mongoose = require("mongoose");

// Password for Vanya Mark -> DiogoBarros1 (admin)

const users = [
  { username: "Vanya Mark", email: "vanya.mark@ironhack.com", passwordHash:"$2a$10$LZ8XiLY1melVKdAr.E/WreBSaO.W66uclyIuH3.7CgKqUhdP7FDua", role: "admin" }  
]

const exhibitions = [{"exhibitionName": "Nature","exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-08-01-2024-Sun-14-01-2024", "archived": true}, 
  
{"exhibitionName": "Future", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-15-01-2024-Sun-21-01-2024", "archived": true, "exhibitionStatus": "cancelled" }, 

{"exhibitionName": "Flowers", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-22-01-2024-Sun-28-01-2024", "archived": true, "exhibitionStatus": "cancelled" }, 

{"exhibitionName": "Puppies' Love", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-29-01-2024-Sun-04-02-2024", "archived": true, "exhibitionStatus": "cancelled" }, 

{"exhibitionName": "Safari", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-05-02-2024-Sun-11-02-2024", "archived": true},

{"exhibitionName": "City Jungle", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-12-02-2024-Sun-18-02-2024", "archived": true},

{"exhibitionName": "Rural Paradise", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-19-02-2024-Sun-25-02-2024", "archived": true},

{"exhibitionName": "Nostalgy", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-26-02-2024-Sun-03-03-2024", "exhibitionStatus": "closed" },

{"exhibitionName": "Coming Home", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-04-03-2024-Sun-10-03-2024", "exhibitionStatus": "closed" },

{"exhibitionName": "Solitude", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-11-03-2024-Sun-17-03-2024",},

{"exhibitionName": "Technology", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-18-03-2024-Sun-24-03-2024"},

{"exhibitionName": "The Other Face of the Moon", "exhibitionDescription":"Placeholder description","exhibitionWeek": "Mon-25-03-2024-Sun-31-03-2024"}
]

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