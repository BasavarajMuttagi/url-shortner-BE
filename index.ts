import express from "express";

import { config } from "dotenv";
import { AuthRouter } from "./src/routes/auth.route";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { ShortenerRouter } from "./src/routes/shortener.route";
import UrlModel from "./src/models/shortener.model";

const currentDate = new Date().toISOString();
config();
export const PORT = process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY as string;
const App = express();
const HttpServer = createServer(App);

App.use(cors());
App.use(bodyParser.json());

App.use("/auth", AuthRouter);
App.use("/shortener", ShortenerRouter);
App.get("/:ShortUrlKey", async (req, res) => {
  try {
    const data = await UrlModel.findOneAndUpdate(
      { shortUrlKey: req.params.ShortUrlKey },
      { $push: { visits: currentDate } },
      { new: true }
    );

    if (data) {
      console.log(data);
      res.redirect(302, data.originalUrl);
      return;
    }

    res.status(404).send("URL not found");
    return;
  } catch (error) {
    res.status(500).send("Internal Server Error");
    return;
  }
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    HttpServer.listen({ port: PORT }, () => {
      console.log(`Server Listening At ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection Error");
  });

  export default App;