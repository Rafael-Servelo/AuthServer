const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken");

const authController = require("../controllers/authControllers");

router.get("/", authController.open);
router.get("/:id", checkToken, authController.openID);
router.post("/register", authController.registerUser);
router.post("/login", authController.login);

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ msg: "Acesso negado!" });
    }
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (error) {
      console.error(error);
      res.status(400).json({ msg: "Token inválido!" });
    }
  }

module.exports = router;