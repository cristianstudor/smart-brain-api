import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";
import signin from "./controllers/signin.js";
import register from "./controllers/register.js";
import profile from "./controllers/profile.js";
import image from "./controllers/image.js";

const app = express();

app.use(cors());
app.use(express.json());

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_URL,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});

app.get("/", (req, res) =>
  db
    .select("*")
    .from("users")
    .then((users) => res.json(users))
);

app.post("/signin", (req, res) =>
  signin.handleSigninPost(req, res, db, bcrypt)
);

app.post("/register", (req, res) =>
  register.handleRegisterPost(req, res, db, bcrypt)
);

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

app.put("/image", (req, res) => image.handleImagePut(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});
