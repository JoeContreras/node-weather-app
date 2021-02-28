const request = require("request");
const forecast = (longitude, latitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=694a2b269c9e7a1e77fa21ee82d5613f&query=" +
    encodeURIComponent(latitude) +
    "," +
    encodeURIComponent(longitude) +
    "&units=f";
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service");
    } else if (body.error) {
      callback("something went wrong. unable to find location");
    } else {
      const {
        temperature,
        feelslike,
        weather_descriptions,
        humidity,
      } = body.current;
      callback(
        undefined,
        `${weather_descriptions[0]}. It's currently ${temperature} degrees out. But it feels like ${feelslike} degrees. The humitity is at ${humidity}%`
      );
    }
  });
};

module.exports = forecast;
