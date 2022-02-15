const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const {
  getTalkers,
  validateEmail,
  validatePassword,
} = require('./validations');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const allTalkers = await getTalkers();

  if (!allTalkers) return res.status(200).json({ message: [] });

  res.status(200).send(allTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalkers();
  const filterId = allTalkers.find((el) => el.id === Number(id));

  if (!filterId) {
    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).send(filterId);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token: `${token}` });
});

app.listen(PORT, () => {
  console.log('Online');
});
