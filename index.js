const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talkerJsonPath = './talker.json';

const {
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalkDateType,
  validateTalkRate,
  validateTalk,
  getTalkers,
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

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkDateType,
  validateTalkRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const allTalkers = await getTalkers();

    await fs.writeFile(
      talkerJsonPath,
      JSON.stringify([...allTalkers, { name, id: 5, age, talk }]),
    );

    res.status(201).json({ name, id: 5, age, talk });
  },
);

app.put(
  '/talker/:id',
  validateToken, validateName, validateAge, validateTalk,
  validateTalkDateType, validateTalkRate,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const allTalkers = await getTalkers();
    const talkerIndex = await fs
      .readFile(talkerJsonPath, 'utf8')
      .then((response) =>
        JSON.parse(response).findIndex((r) => Number(r.id) === Number(id)));
    
    if (talkerIndex === -1) { return res.status(404).json({ message: 'Talker not found!' }); }
    await fs.writeFile(
      talkerJsonPath,
      JSON.stringify([
        ...allTalkers, (allTalkers[talkerIndex] = {
          ...allTalkers[talkerIndex], name, age, talk }),
      ]),
    );
    res.status(200).send({ name, age, id: Number(id), talk });
  },
);

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalkers();

  const talkerIndex = await fs
    .readFile(talkerJsonPath, 'utf8')
    .then((response) =>
      JSON.parse(response).findIndex((r) => Number(r.id) === Number(id)));
  await fs.writeFile(
    talkerJsonPath,
    JSON.stringify([allTalkers.splice(talkerIndex, 1)]),
  );
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
