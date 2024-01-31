import jwt from "jsonwebtoken";
import "dotenv/config";
import express from "express";
const PORT = process.env.PORT;
/* const myToken = jwt.sign(user, process.env.SECRET); */

const app = express();
app.use(express.json());

const DATABASE_USERS = [
  {
    username: "admin",
    password: "admin123",
  },
  {
    username: "user",
    password: "user123",
  },
];
const DATABASE_DATA = [
  { id: 1, content: "secret 1" },
  { id: 2, content: "secret 2" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (checkPassword(username, password)) {
    const token = jwt.sign({ user: username }, process.env.SECRET);
    res.json({ accessToken: token });
  } else {
    res.json({
      message: "failed",
    });
  }
});

function checkPassword(username, password) {
  for (const user of DATABASE_USERS) {
    if (username === user.username && password === user.password) {
      return true;
    }
  }
  return false;
}

app.get("/data", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET);
    res.json(DATABASE_DATA);
  } catch (e) {
    res.status(404).json({
      message: "invalid token",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "Server Running",
  });
});

app.listen(PORT, () => {
  console.log("server running on port: ", PORT);
});
