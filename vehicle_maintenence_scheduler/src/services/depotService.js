require("dotenv").config();
const axios = require("axios");
const Log = require("../../../logging_middleware/logger");

async function fetchDepots() {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
      throw new Error("ACCESS_TOKEN not found in environment");
    }

    await Log("backend", "info", "service", "Fetching depots from API");

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/depots",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const depots = response.data.depots || [];
    await Log("backend", "info", "service", `Successfully fetched ${depots.length} depots`);
    return depots;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const errorMsg = status
      ? `HTTP ${status} - ${JSON.stringify(data)}`
      : error.message;
    console.error("fetchDepots error:", errorMsg);
    await Log("backend", "error", "service", `Failed to fetch depots: ${errorMsg}`);
    throw error;
  }
}

module.exports = { fetchDepots };
