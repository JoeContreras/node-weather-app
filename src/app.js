const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;
//Define paths for express config
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup hbs engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup publlic static directory to serve
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather app",
    name: "Joe",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Joe",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    message: "If you have questions visit google.com",
    title: "Help",
    name: "Joe",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error,
          });
        }
        res.send({
          forecast: forecastData,
          location: location,
          address: req.query.address,
        });
      });
    }
  );
});
app.get("/help/*", (req, res) => {
  res.render("404-page", {
    title: "404",
    message: "Help page not found",
    name: "Joe",
  });
});
app.get("*", (req, res) => {
  res.render("404-page", {
    title: "404",
    message: "Page not found",
    name: "Joe",
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
