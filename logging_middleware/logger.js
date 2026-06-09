require("dotenv").config();

const axios = require("axios");
const { validStacks, validLevels, validPackages } = require("./constants");

async function Log(stack, level, packageName, message) {
  if (!validStacks.includes(stack)) {
    throw new Error(`Invalid stack. Expected one of: ${validStacks.join(", ")}`);
  }

  if (!validLevels.includes(level)) {
    throw new Error(`Invalid level. Expected one of: ${validLevels.join(", ")}`);
  }

  if (!validPackages.includes(packageName)) {
    throw new Error(`Invalid package name. Expected one of: ${validPackages.join(", ")}`);
  }

  if (!message || typeof message !== "string" || message.trim() === "") {
    throw new Error("Message is required and cannot be empty.");
  }

  const rawToken = process.env.ACCESS_TOKEN;
  const token = rawToken && typeof rawToken === "string" ? rawToken.trim() : "";

  if (!token) {
    throw new Error("ACCESS_TOKEN is missing or empty. Add a valid ACCESS_TOKEN to your .env file.");
  }

  const url = "http://4.224.186.213/evaluation-service/logs";
  const body = {
    stack,
    level,
    package: packageName,
    message
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };


  try {
    if (process.env.LOG_DRY_RUN === "true") {
      const fake = { logID: `dry-run-${Date.now()}` };
      console.log("Dry-run log created", fake.logID);
      return fake;
    }
    const response = await axios.post(url, body, { headers });
    console.log("Log created successfully");
    console.log("logID:", response.data.logID || response.data.id || "unknown");
    return response.data;
  } catch (error) {
    const apiMessage = error.response && error.response.data && error.response.data.message;
    if (apiMessage) {
      console.error("API error:", apiMessage);
    } else if (error.message) {
      console.error("Request failed:", error.message);
    } else {
      console.error("An unknown error occurred while sending the log.");
    }
    // Do not throw here; logging failures should not crash the application.
    return null;
  }
}

module.exports = Log;
