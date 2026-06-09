const fs = require('fs');
const { fetchNotifications } = require('./notificationService');
const { getTopNotifications } = require('./priorityService');

async function main() {
  try {
    const notifications = await fetchNotifications();
    const topNotifications = getTopNotifications(notifications);

    console.log('Top 10 Notifications:');
    console.log(JSON.stringify(topNotifications, null, 2));

    fs.writeFileSync('output.json', JSON.stringify(topNotifications, null, 2));
    console.log('Saved top notifications to output.json');
  } catch (error) {
    console.error('Application error:', error.message);
    process.exit(1);
  }
}

main();
