import { api } from './authService';

/**
 * Service layer responsible for machine learning fraud prediction requests.
 * Reuses the pre-configured secure Axios client.
 */
export const predictionService = {
  /**
   * Evaluates transaction metrics for fraud risks.
   * 
   * @param {Object} transactionData
   * @returns {Promise<Object>} risk classification statistics
   */
  predictFraud: async (transactionData) => {
    try {
      const response = await api.post('/predict', transactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  },

  /**
   * Triggers a reload of the joblib model pipeline on the backend.
   * Requires administrative analyst tokens.
   */
  reloadModel: async () => {
    try {
      const response = await api.post('/reload-model');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  },

  /**
   * Retrieves prediction logs chronologically from the database.
   */
  fetchHistory: async () => {
    try {
      const response = await api.get('/predictions');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  }
};

export default predictionService;
