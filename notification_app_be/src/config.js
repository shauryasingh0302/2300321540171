require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_URL = 'http://4.224.186.213/evaluation-service/notifications';

if (!ACCESS_TOKEN) {
  console.error('Missing ACCESS_TOKEN in .env. Copy .env.example and set ACCESS_TOKEN.');
}

module.exports = {
  ACCESS_TOKEN,
  API_URL
};
