const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Public Route
 */
exports.open = async (req, res) => {
  res.status(200).json({ msg: "The server is running!" });
};

/**
 * Private Route
 */
exports.openID = async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
};

/**
 * Register User
 */
exports.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
  
    // validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatório!" });
    }
    if (password !== confirmPassword) {
      return res.status(422).json({ msg: "As senhas não conferem!" });
    }
  
    // check if user exists
    const userExists = await User.findOne({ email: email });
  
    if (userExists) {
      return res.status(422).json({ msg: "Por favor, utilize outro email!" });
    }
  
    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
  
    // create usere
    const user = new User({
      name,
      email,
      password: passwordHash,
    });
  
    try {
      await user.save();
  
      res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Erro inesperado no servidor, tente novamente mais tarde!",
      });
    }
  };

    /**
   * Login User
   */
  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    // validations
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatório!" });
    }
  
    // check if user exists
    const user = await User.findOne({ email: email });
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
  
    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password);
  
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!" });
    }
  
    try {
      const secret = process.env.SECRET;
  
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );
  
      res.status(200).json({
        msg: "Autenticação realizada com sucesso!",
        userID: user.id,
        token,
      });
    } catch (error) {
      console.error(error);
    }
  };



