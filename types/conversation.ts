export interface Conversation {
  _id: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  autor: "user" | "agent";
  text: string;
  timestamp?: string;
}

export interface CreateConversationPayload {
  userId: string;
  title: string;
}