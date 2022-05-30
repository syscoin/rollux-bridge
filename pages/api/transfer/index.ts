import connectDB from "db/connection";
import Transfer from "db/models/transfer";
import { NextApiHandler } from "next";

const getAll: NextApiHandler = async (req, res) => {
  const { nevm, utxo } = req.query;
  const transfers = await Transfer.find({
    $or: [
      {
        nevmAddress: nevm,
      },
      {
        utxoAddress: utxo,
      },
    ],
  }).sort({ createdAt: -1 });
  return res.status(200).json(transfers);
};

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    getAll(req, res);
  }
};

export default connectDB(handler);
