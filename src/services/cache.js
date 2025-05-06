const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const cacheCountryData = async (countryId, data) => {
  await redis.set(`country:${countryId}`, JSON.stringify(data), 'EX', 900);
};

const getCachedCountryData = async (countryId) => {
  const data = await redis.get(`country:${countryId}`);
  return data ? JSON.parse(data) : null;
};

module.exports = { cacheCountryData, getCachedCountryData };