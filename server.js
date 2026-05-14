const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

/* =========================
   DATABASE
========================= */

const dataFile = "data.json";

function loadData() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]");
    }
    return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

/* =========================
   EMAIL CONFIG
========================= */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "neelgeorgetelegraph@gmail.com",
        pass: "bqdt zbbx qild arwu"
    }
});

/* =========================
   CERTIFICATE HTML
========================= */

function generateCertificate(data, certId){

return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>

body{
    margin:0;
    padding:0;
    background:#0f172a;
    font-family:'Times New Roman', serif;
}

.certificate{
    width:1123px;
    height:794px;
    background:white;
    position:relative;
    overflow:hidden;
    border:12px solid #c89b3c;
}

/* INNER BORDER */
.inner{
    position:absolute;
    top:15px;
    left:15px;
    right:15px;
    bottom:15px;
    border:3px solid #d4af37;
}

/* HEADER */
.top{
    background:linear-gradient(90deg,#0b1f4d,#122b66,#0b1f4d);
    color:white;
    text-align:center;
    padding:18px;
    border-bottom:5px solid #d4af37;
}

.top h1{
    margin:0;
    font-size:42px;
    letter-spacing:3px;
}

.top p{
    margin:5px 0 0;
    color:#d4af37;
    font-size:20px;
}

/* CERT ID */
.cert-id{
    position:absolute;
    top:110px;
    right:60px;
    text-align:right;
    font-size:18px;
    font-weight:bold;
}

/* CONTENT */
.content{
    padding:40px 80px;
    text-align:center;
}

.title{
    font-size:80px;
    font-weight:bold;
    color:#0b1f4d;
    margin-top:20px;
}

.sub{
    font-size:38px;
    color:#b8860b;
    margin-top:10px;
}

.line{
    width:300px;
    height:3px;
    background:#b8860b;
    margin:20px auto;
}

.text{
    font-size:28px;
    color:#333;
    margin-top:18px;
}

.name{
    font-size:72px;
    color:#0b1f4d;
    font-family:cursive;
    margin:20px 0;
    font-weight:bold;
}

.project{
    font-size:40px;
    color:#0b1f4d;
    font-weight:bold;
    margin-top:10px;
}

.course{
    color:#b8860b;
    font-weight:bold;
}

/* FOOTER */
.footer{
    position:absolute;
    bottom:100px;
    width:100%;
    display:flex;
    justify-content:space-around;
}

.sign{
    text-align:center;
}

.signature{
    font-family:cursive;
    font-size:38px;
}

.sign-line{
    width:220px;
    height:2px;
    background:#000;
    margin:5px auto;
}

.sign-title{
    font-size:22px;
    font-weight:bold;
    color:#0b1f4d;
}

/* BOTTOM */
.bottom{
    position:absolute;
    bottom:0;
    width:100%;
    background:linear-gradient(90deg,#0b1f4d,#122b66,#0b1f4d);
    color:white;
    text-align:center;
    padding:18px;
    border-top:5px solid #d4af37;
}

.bottom h2{
    margin:0;
    font-size:30px;
}

.bottom p{
    margin:5px 0 0;
    color:#d4af37;
    font-size:20px;
}

</style>

</head>

<body>

<div class="certificate">

<div class="inner"></div>

<div class="top">
    <h1>SKILL FAIR 2026</h1>
    <p>THE GEORGE TELEGRAPH TRAINING INSTITUTE</p>
</div>

<div class="cert-id">
    CERTIFICATE ID<br>
    ${certId}
</div>

<div class="content">

    <div class="title">
        CERTIFICATE
    </div>

    <div class="sub">
        OF PARTICIPATION
    </div>

    <div class="line"></div>

    <div class="text">
        This is to certify that
    </div>

    <div class="name">
        ${data.name}
    </div>

    <div class="line"></div>

    <div class="text">
        of <span class="course">${data.course}</span> has successfully participated in
    </div>

    <div class="project">
        SKILL FAIR 2026
    </div>

    <div class="text">
        for the project titled
    </div>

    <div class="project">
        "${data.project}"
    </div>

    <div class="text">
        held at ${data.place}.<br>
        We appreciate your creativity, hard work and contribution.
    </div>

</div>

<div class="footer">

    <div class="sign">
        <div class="signature">Aman</div>
        <div class="sign-line"></div>
        <div class="sign-title">DIRECTOR</div>
    </div>

    <div class="sign">
        <div class="signature">Bunita</div>
        <div class="sign-line"></div>
        <div class="sign-title">CENTRE HEAD</div>
    </div>

</div>

<div class="bottom">
    <h2>THE GEORGE TELEGRAPH TRAINING INSTITUTE</h2>
    <p>MIDNAPORE CENTRE</p>
</div>

</div>

</body>
</html>
`;

}

/* =========================
   SUBMIT API
========================= */

app.post("/submit", async (req, res) => {

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

    /* CERTIFICATE HTML */
    const certificateHTML = generateCertificate(data, certId);

    try {

        await transporter.sendMail({

            from: "Skill Fair 2026 <neelgeorgetelegraph@gmail.com>",

            to: data.email,

            subject: "Skill Fair 2026 Certificate",

            html: certificateHTML

        });

        res.json({
            success: true,
            certId
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false
        });

    }

});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
