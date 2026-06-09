const axios = require('axios');
const { API_URL, ACCESS_TOKEN } = require('./config');

async function fetchNotifications() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    const notifications = response.data.notifications || [];
    return notifications.map((item) => ({
      id: item.id || item.ID,
      type: item.type || item.Type,
      message: item.message || item.Message,
      createdAt: item.createdAt || item.Timestamp
    }));
  } catch (error) {
    const status = error.response?.status;
    const body = error.response?.data;
    console.error('Failed to fetch notifications:', status, body || error.message);
    throw new Error('Could not fetch notifications.');
  }
}

module.exports = {
  fetchNotifications
};
