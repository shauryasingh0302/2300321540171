// Simple test runner for the scheduler logic using sample data.
process.env.LOG_DRY_RUN = "true";
const fs = require("fs");
const Log = require("../logging_middleware/logger");
const { solveKnapsack } = require("./src/utils/knapsack");

async function runTest() {
  try {
    await Log("backend", "info", "service", "Starting scheduler test with sample data");

    const depots = [ { ID: 1, MechanicHours: 60 }, { ID: 2, MechanicHours: 40 } ];
    const vehicles = [
      { TaskID: "task-1", Duration: 5, Impact: 8 },
      { TaskID: "task-2", Duration: 10, Impact: 20 },
      { TaskID: "task-3", Duration: 15, Impact: 30 },
      { TaskID: "task-4", Duration: 8, Impact: 12 },
      { TaskID: "task-5", Duration: 12, Impact: 25 },
      { TaskID: "task-6", Duration: 20, Impact: 35 }
    ];

    const results = [];
    for (const depot of depots) {
      const res = solveKnapsack(vehicles, depot.MechanicHours);
      results.push({
        depotId: depot.ID,
        mechanicHours: depot.MechanicHours,
        totalImpact: res.totalImpact,
        totalDuration: res.totalDuration,
        selectedTaskCount: res.selectedVehicles.length,
        selectedTasks: res.selectedVehicles
      });
      await Log("backend", "info", "service", `Depot ${depot.ID} optimized: impact ${res.totalImpact}`);
    }

    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
    await Log("backend", "info", "service", "Test completed and output.json written");
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    await Log("backend", "error", "service", `Test failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

runTest();
