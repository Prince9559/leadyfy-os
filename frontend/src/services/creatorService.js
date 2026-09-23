import api from "./api";

export const createCreator = async (creatorData) => {
  const response = await api.post("/creators", creatorData);
  return response.data;
};

export const getCreators = async () => {
  const response = await api.get("/creators");
  return response.data;
};

export const getCreatorById = async (id) => {
  const response = await api.get(`/creators/${id}`);
  return response.data;
};

export const updateCreator = async (id, creatorData) => {
  const response = await api.put(
    `/creators/${id}`,
    creatorData
  );
  return response.data;
};

export const deleteCreator = async (id) => {
  const response = await api.delete(`/creators/${id}`);
  return response.data;
};