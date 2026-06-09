const Log = require("./logger");

async function main() {
  try {
    await Log("backend", "info", "service", "Logging middleware test started");

    await Log("backend", "info", "service", "Vehicle scheduling started");

    await Log("backend", "debug", "route", "Received request for depot data");
  } catch (error) {
    console.error("Logging test failed:", error.message);
  }
}

main();
