import { Schema, model, models } from "mongoose";

const LogPayload = new Schema({
  message: Schema.Types.String,
  data: Schema.Types.Mixed,
});

const TransferLogSchema = new Schema({
  status: Schema.Types.String,
  payload: LogPayload,
});

const TransferSchema = new Schema({
  id: Schema.Types.String,
  type: Schema.Types.String,
  status: Schema.Types.String,
  amount: Schema.Types.String,
  createdAt: Schema.Types.Date,
  updatedAt: Schema.Types.Date,
  logs: [TransferLogSchema],
  utxoAddress: Schema.Types.String,
  nevmAddress: Schema.Types.String,
});

const Transfer = models.Transfer ?? model("Transfer", TransferSchema);

export default Transfer;
