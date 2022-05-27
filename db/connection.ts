import mongoose from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const connectDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (mongoose.connections[0].readyState) {
      // Use current db connection
      return handler(req, res);
    }
    // Use new db connection
    const mongoUrl =
      process.env.MONGODB_URI ?? "mongodb://localhost/syscoin-bridge";
    console.log("Connecting to", mongoUrl);
    await mongoose.connect(mongoUrl);
    return handler(req, res);
  };

export default connectDB;
