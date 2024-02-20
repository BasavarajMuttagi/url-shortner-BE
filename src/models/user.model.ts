import { Schema, model } from "mongoose";

const userRegistrationSchema = new Schema(
  {
    email: { type: String, unique: true },
    username: { type: String },
    password: { type: String },
    All_URLS: [{ type: Schema.Types.ObjectId, ref: "Url" }],
  },
  { timestamps: true }
);

const UserModel = model("User", userRegistrationSchema);

export default UserModel;
