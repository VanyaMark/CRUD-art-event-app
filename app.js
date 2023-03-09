// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

               
require("./config/session.config")(app);
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "CRUD-art-event-app";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const visitorRoutes = require("./routes/visitor.routes");
app.use("/", visitorRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/", adminRoutes);

const artistRoutes = require("./routes/artist.routes");
app.use("/", artistRoutes); 

const exhibitionRoutes = require("./routes/exhibition.routes");
app.use("/", exhibitionRoutes); 

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
