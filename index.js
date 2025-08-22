const express = require("express");
const { default: mongoose } = require('mongoose');
const { MONGOURI } = require('./keys');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGOURI)
.then(() => {
  console.log("MongoDB connected successfully");
}
).catch(err => {
  console.error("MongoDB connection error:", err);
});

const port = 3000;

app.get('/api/health', (req, res) => {
  res.send("api health is good");
}); 

// Importing routes
app.use("/api/auth", require("./controllers/auth"));
app.use("/api/post", require("./controllers/post"));

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});


