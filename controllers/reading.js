"use strict";

const logger = require("../utils/logger");
const axios = require("axios");
const uuid = require("uuid");

const reading= {
  index(request, response) {
    logger.info("Reading rendering");
    const viewData = {
      title: "WeatherTop"
    };
    response.render("reading", viewData);
  },
  async addreport(request, response) {
    logger.info("rendering new report");
    let report = {};
     let lastReading;
    const lat = request.body.lat;
    const lng = request.body.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=<<Enter your API Key>>`
    const requestIcon = `http://openweathermap.org/img/wn/`
    const thingspeak_api=`https://api.thingspeak.com/channels/1558527/feeds.json?api_key=<<api code>>&results`
    const result = await axios.get(requestUrl);
    const result_thingspeak= await axios.get(thingspeak_api);
    if (result.status == 200) {
      const reading = result.data.current;
      report.code = reading.weather[0].id;
      report.icon = requestIcon + reading.weather[0].icon+ ".png";
      report.weather= reading.weather[0].description;
      report.temperature = reading.temp;
      report.feelslike= reading.feels_like;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.dew_point = reading.dew_point
      report.windDirection = reading.wind_deg;
      report.humidity = reading.humidity;}
      report.Trend = [];
   
      report.trendLabels = [];
      const trends = result.data.feeds;
    if (result_thingspeak.status == 200) {
     const reading_inside =result_thingspeak.data.feeds
     if (reading_inside.length>0){
         lastReading = reading_inside[reading_inside.length-1]
         }
      report.field1=lastReading.field1;
      report.field2=lastReading.field2;
      report.field3=lastReading.field3;
      report.field4=lastReading.field4;

      
    }
    const viewData = {
      title: "Weather Report",
      reading: report,
      reading_inside: report,
    };
    response.render("reading", viewData);
  }
};

module.exports = reading;