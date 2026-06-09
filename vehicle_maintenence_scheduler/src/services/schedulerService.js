const Log = require("../../../logging_middleware/logger");
const { fetchDepots } = require("./depotService");
const { fetchVehicles } = require("./vehicleService");
const { solveKnapsack } = require("../utils/knapsack");

async function optimizeSchedule() {
  try {
    await Log("backend", "info", "service", "Scheduler service started");

    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    await Log("backend", "info", "service", "Starting optimization for all depots");

    const results = [];

    for (const depot of depots) {
      const depotId = depot.ID;
      const mechanicHours = depot.MechanicHours;

      await Log("backend", "debug", "service", `Processing depot ${depotId} with capacity ${mechanicHours}`);

      const knapsackResult = solveKnapsack(vehicles, mechanicHours);

      const result = {
        depotId,
        mechanicHours,
        totalImpact: knapsackResult.totalImpact,
        totalDuration: knapsackResult.totalDuration,
        selectedTaskCount: knapsackResult.selectedVehicles.length,
        selectedTasks: knapsackResult.selectedVehicles
      };

      results.push(result);

      await Log(
        "backend",
        "info",
        "service",
        `Depot ${depotId}: scheduled ${result.selectedTaskCount} tasks, total impact ${result.totalImpact}`
      );
    }

    await Log("backend", "info", "service", "Optimization completed for all depots");
    return results;
  } catch (error) {
    await Log("backend", "error", "service", `Scheduler error: ${error.message}`);
    throw error;
  }
}

module.exports = { optimizeSchedule };
