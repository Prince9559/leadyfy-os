import api from "./api";

export const createVideo = async (videoData) => {
  const response = await api.post("/videos", videoData);
  return response.data;
};

export const getVideos = async () => {
  const response = await api.get("/videos");
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await api.get(`/videos/${id}`);
  return response.data;
};

export const updateVideo = async (id, videoData) => {
  const response = await api.put(
    `/videos/${id}`,
    videoData
  );
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(
    `/videos/${id}`
  );
  return response.data;
};

export const clientReviewVideo = async (
  id,
  action
) => {
  const response = await api.patch(
    `/videos/${id}/client-review`,
    { action }
  );
  return response.data;
};