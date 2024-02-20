import { Request, Response } from "express";

import * as crypto from "crypto";
import UrlModel from "../models/shortener.model";
import UserModel from "../models/user.model";

const createShortLink = async (req: Request, res: Response) => {
  try {
    const {
      URL,
      user: { email },
    } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const URL_HASH = await generateRandomHash(URL);
    const URL_RECORD = await UrlModel.create({
      originalUrl: URL,
      shortUrlKey: URL_HASH,
      userId: user._id,
    });

    await UserModel.updateOne(
      { email },
      { $push: { All_URLS: URL_RECORD._id } }
    );
    res
      .status(201)
      .send({ message: "Short Url Created!", ShortUrlKey: URL_HASH });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getAllUrls = async (req: Request, res: Response) => {
  try {
    const {
      user: { email },
    } = req.body;

    const user = await UserModel.findOne({ email })
      .populate("All_URLS")
      .select("All_URLS");

    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    let count = 0;
    user.All_URLS.forEach((element: any) => {
      count = count + element.visits.length;
    });

    const users = count;
    res.status(200).send({
      message: "Success",
      All_URLS: user.All_URLS,
      total_urls_created: user.All_URLS.length,
      users,
    });
    return;
  } catch (error) {
    res.status(500).send("Internal Server Error");
    return;
  }
};

const deleteOneUrl = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      user: { email },
    } = req.body;

    const user = await UserModel.findOne({ email }).updateOne({
      $pull: { All_URLS: _id },
    });

    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    res.status(200).send({ message: "Success" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export { createShortLink, getAllUrls, deleteOneUrl };

async function generateRandomHash(input: string) {
  // Generate a random seed
  const seed = await crypto.randomBytes(16).toString("hex");

  // Combine the input and seed
  const combinedInput = input + seed;

  // Using SHA-256 for hashing
  const sha256Hash = await crypto
    .createHash("sha256")
    .update(combinedInput)
    .digest("hex");

  // Take a slice to get a fixed-size portion of the hash
  const sixDigitHash = sha256Hash.slice(0, 6);

  return sixDigitHash;
}
