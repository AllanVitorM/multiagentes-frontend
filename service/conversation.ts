import api from "./api";

export const criarConversa = async (payload) => {
  const { data } = await api.post("/conversation", payload);
  return data;
};

export const getConversasUser = async (userId: any) => {
  const { data } = await api.get(`/conversation/user/${userId}`);
  return data;
};

export const getConversaHistorico = async (conversationId: any) => {
  const { data } = await api.get(`/conversation/history/${conversationId}`);
  return data;
};

export const MessageConversa = async (conversationId, payload) => {
  const { data } = await api.post(
    `/conversation/${conversationId}/message`,
    payload
  );
  return data;
};

export const deleteConversa = async (conversationId) => {
  const { data } = await api.delete(`/conversation/${conversationId}`);
  return data;
};
