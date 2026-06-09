require("dotenv").config();
const axios = require("axios");
const Log = require("../../../logging_middleware/logger");

async function fetchVehicles() {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
      throw new Error("ACCESS_TOKEN not found in environment");
    }

    await Log("backend", "info", "service", "Fetching vehicles from API");

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/vehicles",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const vehicles = response.data.vehicles || [];
    await Log("backend", "info", "service", `Successfully fetched ${vehicles.length} vehicles`);
    return vehicles;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    await Log("backend", "error", "service", `Failed to fetch vehicles: ${errorMsg}`);
    throw error;
  }
}

module.exports = { fetchVehicles };
