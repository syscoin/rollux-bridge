// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from "db/connection";
import Transfer from "db/models/transfer";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Invalid method" });
    return;
  }
  const { id } = req.query;
  const transferBody = req.body;

  let transfer = await Transfer.findOne({
    id,
  });

  if (!transfer) {
    transfer = await Transfer.create({ ...transfer, ...transferBody });
  } else {
    transfer = await Transfer.findOneAndUpdate({ id }, transferBody);
  }

  res.status(200).json(transfer);
}

export default connectDB(handler);
