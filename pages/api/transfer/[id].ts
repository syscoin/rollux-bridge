import firebase from "firebase-setup";
import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const document = await getDoc(
    doc(firebase.firestore, "transfers", id as string)
  );
  if (!document.exists()) {
    return res.status(404).json({ message: "Transfer not found" });
  }
  res.status(200).json(document.data());
};

const patchRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ message: "Missing id" });
  }
  if (process.env.NODE_ENV !== "development") {
    await signInWithEmailAndPassword(
      firebase.auth,
      process.env.FIREBASE_AUTH_EMAIL!,
      process.env.FIREBASE_AUTH_PASSWORD!
    );
  }
  const document = doc(firebase.firestore, "transfers", id as string);

  const transferBody = req.body;

  const results = await getDoc(document);

  if (results.exists()) {
    await updateDoc(document, transferBody);
  } else {
    await setDoc(document, transferBody);
  }
  const updated = await getDoc(document);
  res.status(200).json(updated.data());
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

export default handler;
