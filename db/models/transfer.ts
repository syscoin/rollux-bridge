import { Schema, model, models } from "mongoose";

const TransferSchema = new Schema({
  id: Schema.Types.String,
  type: Schema.Types.String,
  status: Schema.Types.String,
  amount: Schema.Types.String,
  createdAt: Schema.Types.Date,
  updatedAt: Schema.Types.Date,
});

const Transfer = models.Transfer ?? model("Transfer", TransferSchema);

export default Transfer;
