require("dotenv").config();
require("./db");
const express = require("express");
const cors = require("cors");


const app = express();

const allowedDomains = [
  "https://luaminguante.onrender.com",
  "http://192.168.18.7:8080",
];

app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = allowedDomains.includes(origin);
      callback(null, allowed);
    },
  })
);

// Config Json Response
app.use(express.json());

const authRouter = require("./routers/authRouter");

app.use("/auth", authRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(
  {
    host: "0.0.0.0",
    port: port,
  },
  () => {
    console.log(`O Servidor esta rodando na porta ${port}`);
  }
);
