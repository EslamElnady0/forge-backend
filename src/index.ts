import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
