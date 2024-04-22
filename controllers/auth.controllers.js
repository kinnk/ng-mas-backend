const db = require('../db.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const errorHandler = require('../utils/errorHandler');


async function signin(req,res){
  try {
    const {email, password} = req.body;
    const isUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if(isUser.rowCount !== 0){
      // Проверка пароля если пользователь найден
      const comparePassword = await bcrypt.compare(password, isUser.rows[0].password);
      if(comparePassword){
        // генерация jwt токена
        const token = jwt.sign({
          email: isUser.rows[0].email
        }, 'secret-key', {expiresIn: 60 * 60});
        res.status(200).json({
          token: `Bearer ${token}`
        })
      }else{
        res.status(401).json({
          message: 'Пароль не совпадает!',
        })
      }
    }else{
      // Если пользователя нет в базе
      res.status(404).json({
        message: 'Пользователь с таким Email на найден!'
      })
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

async function signup(req,res){
  try {
    const { email, password, username, role } = req.body;
    const isUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if(isUser.rowCount !== 0){
      // Пользователь есть в db
      return res.status(409).json({
        message: 'Пользователь уже существует'
      })
    }else if(!email || !password || !username || !role) {
      // Не все поля заполнены
      return res.status(400).json({ 
        message: 'Не все поля заполнены!' 
      });
    }
    // генерация хеша для пароля 
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`INSERT INTO users (email, password, username, role) VALUES ($1, $2, $3, $4)`, 
    [email, hashedPassword, username, role]);

    return res.status(201).json({
      message: `Пользователь с э-почтой: ${email}, был зарегистрирован!`
    })
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  signin,
  signup
}