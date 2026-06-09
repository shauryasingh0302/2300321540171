function solveKnapsack(vehicles, capacity) {
  if (!vehicles || vehicles.length === 0 || capacity <= 0) {
    return {
      selectedVehicles: [],
      totalImpact: 0,
      totalDuration: 0
    };
  }

  const n = vehicles.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const duration = vehicles[i - 1].Duration;
    const impact = vehicles[i - 1].Impact;

    for (let w = 0; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - duration] + impact
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  const selectedVehicles = [];

  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedVehicles.push(vehicles[i - 1]);
      w -= vehicles[i - 1].Duration;
    }
  }

  const totalDuration = capacity - w;
  const totalImpact = dp[n][capacity];

  return {
    selectedVehicles: selectedVehicles.reverse(),
    totalImpact,
    totalDuration
  };
}

module.exports = { solveKnapsack };
