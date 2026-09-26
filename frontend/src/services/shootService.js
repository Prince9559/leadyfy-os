import api from "./api";

export const createShoot = async (shootData) => {
  const response = await api.post("/shoots", shootData);
  return response.data;
};

export const getShoots = async () => {
  const response = await api.get("/shoots");
  return response.data;
};

export const getShootById = async (id) => {
  const response = await api.get(`/shoots/${id}`);
  return response.data;
};

export const updateShoot = async (id, shootData) => {
  const response = await api.put(`/shoots/${id}`,shootData);
  return response.data;
};

export const deleteShoot = async (id) => {
  const response = await api.delete(`/shoots/${id}`);
  return response.data;
};