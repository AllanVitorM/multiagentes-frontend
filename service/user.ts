import api from "./api";

interface CreateUser {
  name: string;
  email: string;
  password: string;
  enterprise: string;
}

export const CadastroUsuario = async (dados: CreateUser) => {
  const response = await api.post("/users/register", dados);
  return response.data;
};
