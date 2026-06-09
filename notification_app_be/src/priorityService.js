function getTypeWeight(type) {
  if (type === 'Placement') return 3;
  if (type === 'Result') return 2;
  if (type === 'Event') return 1;
  return 0;
}

function getRecencyBonus(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) return 3;
  if (diffDays < 3) return 2;
  if (diffDays < 7) return 1;
  return 0;
}

function calculatePriority(notification) {
  const typeWeight = getTypeWeight(notification.type);
  const recencyBonus = getRecencyBonus(notification.createdAt);
  const priorityScore = typeWeight + recencyBonus;

  return {
    ...notification,
    priorityScore
  };
}

function getTopNotifications(notifications) {
  const scored = notifications.map(calculatePriority);

  scored.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return scored.slice(0, 10);
}

module.exports = {
  calculatePriority,
  getTopNotifications
};
