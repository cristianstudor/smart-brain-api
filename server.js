import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import signin from './controllers/signin.js';
import register from './controllers/register.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';

const app = express();

app.use(express.json());
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    ssl: true
  }
});

app.get('/', (req, res) => res.json("it is working"));

app.post('/signin', (req, res) => signin.handleSigninPost(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegisterPost(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));

app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

app.put('/image', (req, res) => image.handleImagePut(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`)
});
