import api from "./api";

export const createScript = async (scriptData) => {
  const response = await api.post("/scripts", scriptData);
  return response.data;
};

export const getScripts = async () => {
  const response = await api.get("/scripts");
  return response.data;
};

export const getScriptById = async (id) => {
  const response = await api.get(`/scripts/${id}`);
  return response.data;
};

export const updateScript = async (id, scriptData) => {
  const response = await api.put(`/scripts/${id}`, scriptData);
  return response.data;
};

export const deleteScript = async (id) => {
  const response = await api.delete(`/scripts/${id}`);
  return response.data;
};