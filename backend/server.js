const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer: memory storage (file buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route
app.post("/api/career", upload.single("attachment"), async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const cvFile = req.file;

  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Career Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `New Application from ${first_name} ${last_name}`,
      html: `
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
      attachments: [
        {
          filename: cvFile.originalname,
          content: cvFile.buffer,
        },
      ],
    });

    res.status(200).json({ message: "Application sent!" });
  } catch (err) {
    console.error("SendMail Error:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(3000, () => console.log("🚀 Backend running on http://localhost:3000"));
