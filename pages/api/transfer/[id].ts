// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from "db/connection";
import Transfer from "db/models/transfer";
import type { NextApiRequest, NextApiResponse } from "next";

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const transfer = await Transfer.findOne({
    id,
  });
  transfer;
  if (!transfer) {
    return res.status(404).json({ message: "Transfer not found" });
  }
  res.status(200).json(transfer);
};

const patchRequest = async (req: NextApiRequest, res: NextApiResponse) => {
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
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await getRequest(req, res);
    return;
  }
  if (req.method === "PATCH") {
    await patchRequest(req, res);
    return;
  }
  res.status(405).json({ message: "Invalid method" });
}

export default connectDB(handler);
