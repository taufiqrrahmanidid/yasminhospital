// PM2 configuration for production
module.exports = {
  apps: [
    {
      name: 'yasmin-api',
      script: './backend/server.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      merge_logs: true,
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
    },
  ],
};
