import { Schema, model, Document } from "mongoose";

export interface IMessage {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: string;
  modelName: string;
  history: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const ConversationSchema = new Schema<IConversation>({
  userId: { type: String, required: true },
  modelName: { type: String, required: true },
  history: [MessageSchema],
});

export default model<IConversation>("Conversation", ConversationSchema);
