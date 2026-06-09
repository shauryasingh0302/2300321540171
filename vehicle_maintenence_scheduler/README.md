# Vehicle Maintenance Scheduler

## Problem Statement

Given multiple depots with mechanic work hours capacity and a list of vehicle maintenance tasks with duration and impact, find the optimal combination of tasks for each depot that maximizes total impact while staying within available mechanic hours.

This is a classic 0/1 Knapsack optimization problem where:
- Capacity = MechanicHours per depot
- Weight = Duration of each task
- Value = Impact of each task

## Folder Structure

```
vehicle_maintenence_scheduler/
├── src/
│   ├── services/
│   │   ├── depotService.js      (Fetch depots from API)
│   │   ├── vehicleService.js    (Fetch vehicles from API)
│   │   └── schedulerService.js  (Orchestrate optimization)
│   ├── utils/
│   │   └── knapsack.js          (0/1 Knapsack algorithm)
│   └── index.js                 (Entry point)
├── package.json
├── README.md
└── output.json                  (Generated results)
```

## Knapsack Algorithm Explanation

The 0/1 Knapsack problem uses Dynamic Programming to find the optimal solution:

1. Create a DP table where `dp[i]` represents the maximum impact achievable with capacity `i`
2. For each vehicle (task):
   - For each capacity from high to low:
     - Either include the vehicle or exclude it
     - Choose the option that maximizes impact
3. Backtrack through the DP table to identify which vehicles were selected

Time Complexity: O(n × capacity) where n is number of vehicles
Space Complexity: O(capacity)

## Installation

```bash
npm install
```

## Setup

Create a `.env` file in the project root with:

```
ACCESS_TOKEN=your_valid_token_here
```

## Run

```bash
npm start
```

Results will be saved to `output.json`

## Example Output

```json
[
  {
    "depotId": 1,
    "mechanicHours": 60,
    "totalImpact": 120,
    "totalDuration": 58,
    "selectedTaskCount": 12,
    "selectedTasks": [...]
  }
]
```
