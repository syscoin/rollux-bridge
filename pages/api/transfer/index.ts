import { NextApiHandler } from "next";
import firebase from "firebase-setup";
import { collection, getDocs, query, where } from "firebase/firestore";

const getAll: NextApiHandler = async (req, res) => {
  const { nevm, utxo } = req.query;

  const nevmQuery = query(
    collection(firebase.firestore, "transfers"),
    where("nevmAddress", "==", nevm)
  );
  const utxoQuery = query(
    collection(firebase.firestore, "transfers"),
    where("utxoAddress", "==", utxo)
  );

  const { docs: nevmDocs } = await getDocs(nevmQuery);
  const { docs: utxoDocs } = await getDocs(utxoQuery);
  const transactionMap = [
    ...nevmDocs.map((doc) => doc.data()),
    ...utxoDocs.map((doc) => doc.data()),
  ].reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  return res.status(200).json(Object.values(transactionMap));
};

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    getAll(req, res);
  }
};

export default handler;
