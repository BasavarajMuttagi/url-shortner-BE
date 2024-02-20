import { Schema, model } from "mongoose";

const urlSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrlKey: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    visits: [{type:String}],
  },
  { timestamps: true }
);

const UrlModel = model("Url", urlSchema);

export default UrlModel;
