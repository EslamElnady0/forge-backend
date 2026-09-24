import "dotenv/config";
import express from "express";
import apiRouter from "./routes/api.routes";
import { globalErrorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 5005;

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

app.use("/api", apiRouter);

//Global Error Handler
app.use(globalErrorHandler);

//Server Serving lol
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
