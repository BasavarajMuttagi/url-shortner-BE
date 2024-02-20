import express from "express";
import {
  createShortLink,
  deleteOneUrl,
  getAllUrls,
} from "../controllers/shortener.controller";
import { validateToken } from "../middlewares/auth.middleware";
const ShortenerRouter = express.Router();

ShortenerRouter.post("/create", validateToken, createShortLink);
ShortenerRouter.get("/getallurls", validateToken, getAllUrls);
ShortenerRouter.get("/deleteoneurl", validateToken, deleteOneUrl);
export { ShortenerRouter };
