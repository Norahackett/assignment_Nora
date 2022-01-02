"use strict";

const logger = require("../utils/logger");
const axios = require("axios");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const viewData = {
      title: "Weather App"
    };
    response.render("dashboard", viewData);
  },
  async addreport(request, response) {
    logger.info("rendering new report");
    let report = {};
    let array=[]
    const requestUrl = `https://api.thingspeak.com/channels/1558527/feeds.json?api_key=<<api key>>&results=10`
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.channel;
      report.latitude = reading.latitude;
      report.longitude = reading.longitude;
      report.trendLabels = {};
      report.date_created_at=reading.created_at;
      report.updated_at=reading.updated_at; 
      report.trendLabels = [];
       const date_updated = new Date(reading.updated_at);
      report.trendLabels.push(`${date_updated .getDate()}-${date_updated .getMonth()+1}-${date_updated .getFullYear()}`)

      const listDate=[];
      const date_created = new Date(reading.created_at);
      const start_date=(date_created.getDate()+
          "/"+(date_created.getMonth()+1)+
          "/"+date_created.getFullYear()
      )
       const updated_at= new Date(reading.updated_at);
      const end_date=(updated_at.getDate()+
          "/"+(updated_at.getMonth()+1)+
          "/"+updated_at.getFullYear()
      )
     // let dropdown = document.getElementById('locality-dropdown');
     //dropdown.length=0;
     // let defaultOption = document.createElement('option');
     // defaultOption.text = 'Choose State/Province';
      //dropdown.add(defaultOption);
      //dropdown.selectedIndex = 0;
      //if (request.status === 200) {
      //const data = result.data.feeds;
      //let option;
      //for (let i = 0; i < data.length; i++) {
      //option = document.createElement('option');
      //option.text = data[i].created_at;
      //option.value = data[i].field1;
     // dropdown.add(option);
      //}
     // }
      //console.log(end_date)
  const dateMove = new Date(start_date);
      let strDate = start_date;
 while (strDate < end_date){
  strDate = dateMove.toISOString().slice(0, 10);
  listDate.push(strDate);
  dateMove.setDate(dateMove.getDate() + 1);
 }
     console.log(dateMove.getDate() + 1)
     

      //while (start_date< updated_at){
      //  date_list = start_date.setDate(start_date.getDate()+1)
     // }           }
     // console.log(date_list)
      report.Trend = [];
      report.trendLabels = [];
      report.options=[]
      const trends = result.data.feeds;
      for (let i=0; i<trends.length; i++) {
        report.Trend.push(trends[i]);
        const date = new Date(trends[i].created_at);
        report.trendLabels.push(`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`);
        //console.log(date.getDate()+
         // "/"+(date.getMonth()+1)+
         // "/"+date.getFullYear()
         //report.options.push("<option value" ='"+)       
      
        //);
      }
    }

    const viewData = {
      title: "Weather Report",
      reading: report,

    };
    response.render("dashboard", viewData);
  }
};

module.exports = dashboard;
