
//create backend, do npm init
//init makes the package.json
//npm install installs the dependencies
const express = require("express");
const cors = require("cors");
const admin = require("./firebase/cred.js");
const dotenv = require("dotenv").config();
const authMiddleware = require("./auth/index");
const uuid = require("uuid");
const { response } = require("express");

//firestore is the database
//firebase is the entire service
// Intialize firestore instance
const db = admin.firestore();

// Define app and port
const app = express();
const port = process.env.PORT;

// More Middlware
app.use(cors());
app.use(express.json());

//Initialize Port
app.listen(port, () => console.log(`Listening on Port ${port}!`));

// Use Authentication for all Routes
app.use("/", authMiddleware);

// Call to Check if User is Valid
app.get("/auth", authMiddleware, (req, res) => {
  return res.json({ msg: "Success" });
});

app.post('/member', async (req, res) => {
  try {
      const member = req.body.member;
      const snapshot = await db.collection('members');
      
      const USER = {name: member.name, email: member.email, admin: false};
      const user_exists = (await snapshot.doc(member.user_id).get()).exists;
      console.log(user_exists);
      if(!user_exists){
        const newSnapshot = await db.collection('members').doc(member.user_id).set(USER);
        return res.json({msg: "Created a new user", data: USER});
      }else
        return res.json({ msg: "User already exists", data: USER});
      
  } catch (error) {
      return res.status(400).send(`User should contain firstName, lastName, email`)
  }
});