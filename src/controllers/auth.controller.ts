import { Request, Response } from "express";

import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import UserModel from "../models/user.model";

const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordMatch) {
      res.status(400).send({ message: "email or password incorrect" });
      return;
    }
    const token = sign(
      {
        userId: user?._id,
        email,
        username: user.username,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "24h" }
    );
    res.status(200).send({ email, token: token, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      res.status(409).send({ message: "Account Exists!" });
      return;
    }
    const encryprtedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      email,
      username,
      password: encryprtedPassword,
    }).then(() => {
      res.status(201).send({ message: "Account Created SuccessFully!" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

export { LoginUser, RegisterUser };
