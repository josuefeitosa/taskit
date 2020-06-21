const Env = use('Env');

module.exports = {
  // redis connection
  connection: Env.get('BULL_CONNECTION', 'bull'),
  bull: {
    redis: {
      host: 'localhost',
      port: 6379,
      password: null,
      db: 0,
      keyPrefix: '',
    },
  },
  remote: 'redis://redis.example.com?password=correcthorsebatterystaple',
};
