require('dotenv').config();
const axios = require('axios');
const token = process.env.ACCESS_TOKEN;
const body = { stack: 'backend', level: 'info', package: 'service', message: 'Log endpoint test' };
(async () => {
  try {
    const res = await axios.post('http://4.224.186.213/evaluation-service/logs', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('status', res.status);
    console.log('data', JSON.stringify(res.data));
  } catch (err) {
    console.error('error status', err.response?.status);
    console.error('error data', JSON.stringify(err.response?.data));
    console.error('message', err.message);
  }
})();
