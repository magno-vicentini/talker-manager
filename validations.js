const fs = require('fs/promises');

function validateEmail(req, res, next) {
  const { email } = req.body;

  const emailRegex = /\S+@\S+.\S\.+com/;

  if (!email) { return res.status(400).json({ message: 'O campo "email" é obrigatório' }); }

  if (!emailRegex.test(email)) {
 return res
      .status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
}

  next();
}

function validatePassword(req, res, next) {
  const { password } = req.body;

if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });

if (password.length <= 6) {
  return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
}

  next();
}

function getTalkers() {
  return fs
  .readFile('./talker.json', 'utf8')
  .then((response) => JSON.parse(response));
}

function validateToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });

  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
}

function validateName(req, res, next) {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });

  if (name.length <= 3) {
   return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  } 
  next();
}

function validateAge(req, res, next) {
  const { age } = req.body;

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });

  if (Number(age) <= 18) {
   return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  } 
  next();
}
function validateTalk(req, res, next) {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }

  next();
}
function validateTalkDateType(req, res, next) {
  const { talk } = req.body;
  const regexDateType = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

  if (!talk.watchedAt) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }

  if (!regexDateType.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
}

function validateTalkRate(req, res, next) {
  const { talk } = req.body;
  if (talk.rate === undefined) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  if (!Number.isInteger(talk.rate) || talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
}

module.exports = {
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalkDateType,
  validateTalkRate,
  validateTalk,
  getTalkers,
};