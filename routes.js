"use strict";

const express = require("express");
const router = express.Router();


const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const reading = require("./controllers/reading.js");

router.get("/", dashboard.index);
router.get("/dashboard", dashboard.index);
router.post("/dashboard/addreport", dashboard.addreport);
router.get("/about", about.index);

router.get("/reading", reading.index);
router.post("/reading/addreport", reading.addreport);

module.exports = router;
