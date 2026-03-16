import api from "../lib/api";

export const runPrediction = async (data: any) => {
  const response = await api.post("/predict", data);
  return response.data;
};