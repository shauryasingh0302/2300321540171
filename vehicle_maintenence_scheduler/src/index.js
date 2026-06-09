require("dotenv").config();
const fs = require("fs");
const Log = require("../../logging_middleware/logger");
const { optimizeSchedule } = require("./services/schedulerService");

async function main() {
  try {
    await Log("backend", "info", "handler", "Vehicle maintenance scheduler application started");

    const results = await optimizeSchedule();

    await Log("backend", "info", "handler", "Writing results to output.json");

    fs.writeFileSync(
      "output.json",
      JSON.stringify(results, null, 2)
    );

    await Log("backend", "info", "handler", "Application completed successfully");
    
  } catch (error) {
    await Log("backend", "error", "handler", `Application error: ${error.message}`);
    console.error("Application failed:", error.message);
    process.exit(1);
  }
}

main();
