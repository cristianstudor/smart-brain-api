import express from "express";
import cors from "cors";
import knex from "knex";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt-nodejs";
import signin from "./controllers/signin.js";
import register from "./controllers/register.js";
import profile from "./controllers/profile.js";
import image from "./controllers/image.js";

const supabaseUrl = "https://bwkdcqbuyzektbbhhcaz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3a2RjcWJ1eXpla3RiYmhoY2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk3MTAxODUsImV4cCI6MTk4NTI4NjE4NX0.ULB6HSikNpd0bH5fgt6TP_0gJDLaffz-CEi7vsROAJk";
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors());
app.use(express.json());

const db = knex({
  client: supabase
  // connection: {
  //   connectionString: process.env.DATABASE_URL,
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // }
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
