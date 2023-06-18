import { NextApiHandler } from "next";
import firebase from "firebase-setup";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const getAll: NextApiHandler = async (req, res) => {
  const { nevm, utxo } = req.query;
  if (!nevm || !utxo) {
    return res.status(400).json({ message: "Some parameters are missing" });
  }

  if (process.env.NODE_ENV !== "development" && firebase.auth) {
    await signInWithEmailAndPassword(
      firebase.auth,
      process.env.FIREBASE_AUTH_EMAIL!,
      process.env.FIREBASE_AUTH_PASSWORD!
    );
  }

  const transferQuery = query(
    collection(firebase.firestore, "transfers"),
    where("nevmAddress", "==", nevm),
    where("utxoAddress", "==", utxo),
    orderBy("createdAt", "desc")
  );

  const { docs } = await getDocs(transferQuery);

  return res.status(200).json(Object.values(docs.map((doc) => doc.data())));
};

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    getAll(req, res);
  }
};

export default handler;
