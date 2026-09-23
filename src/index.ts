import "dotenv/config";
import express, { NextFunction } from "express";
import { User } from "./user";
import { Validator } from "./validator";
const app = express();
const PORT = process.env.PORT || 5005;

let users: User[] = [];

app.use(express.json());

//Check the content type of the post request

app.use((req, res, next) => {
  if (
    req.method == "POST" &&
    !(req.headers["content-type"] == "application/json")
  ) {
    return res.status(400).json({
      success: false,
      message: "POST request should have content type of application/json",
    });
  }
  next();
});

//Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] --> ${req.url}`);
  next();
});

//Endpoints

app.get("/api/health", (req, res, next) => {
  console.log(`health endpoint triggered, server running on port ${PORT}`);

  return res.send("Server Working");
});

app.get("/api/users", (req, res, next) => {
  return res.status(200).json({
    users,
  });
});

app.get("/api/users/:id", (req, res, next) => {
  const rawId = req.params.id;

  // Use a Regular Expression to check if the string is strictly digits
  if (!/^\d+$/.test(rawId)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  let id = parseInt(req.params.id, 10);
  const user: User | undefined = users.find((user) => {
    return id === user.id;
  });
  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    return res.status(404).json({
      message: "Not Found",
    });
  }
});

app.post("/api/users", (req, res, next) => {
  const name = req.body.name as string | undefined;
  const email = req.body.email as string | undefined;

  const errors = Validator.validate((v) => {
    v.for("name", name).required();
    v.for("email", email).required().isEmail();
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const user: User = new User(req.body.name, req.body.email);
  users.push(user);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

//Server Serving lol
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
