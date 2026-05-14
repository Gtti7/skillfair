const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// allow frontend
const cors = require("cors");
app.use(cors());

// fake database (Excel alternative)
const dataFile = "data.json";

// load data
function loadData(){
  if(!fs.existsSync(dataFile)){
    fs.writeFileSync(dataFile, "[]");
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

// save data
function saveData(data){
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// EMAIL CONFIG (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "neelgeorgetelegraph@gmail.com",
    pass: "bqdt zbbx qild arwu"
  }
});

// submit API
app.post("/submit", (req,res)=>{

  const data = req.body;

  const db = loadData();

  const certId = "GTTI-" + Date.now();

  const newEntry = {
    ...data,
    certId,
    date: new Date()
  };

  db.push(newEntry);
  saveData(db);

  // send email
  transporter.sendMail({
    from: "Skill Fair 2026 <neelgeorgetelegraph@gmail.com>",
    to: data.email,
    subject: "Skill Fair 2026 Certificate",
    text: `
Congratulations ${data.name}

Course: ${data.course}
Project: ${data.project}
Certificate ID: ${certId}

- The George Telegraph Training Institute
    `
  });

  res.json({success:true, certId});
});

// start server
app.listen(3000, ()=>{
  console.log("Server running on http://localhost:3000");
});
