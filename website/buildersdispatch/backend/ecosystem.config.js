// PM2 Ecosystem Configuration for BuildersDispatch
// File: ecosystem.config.js
// Deploy: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'buildersdispatch-api',
      script: './server.js',
      cwd: '/var/www/buildersdispatch/backend',
      instances: 1,  // Single instance for KVM2 (2GB RAM)
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'staging',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/buildersdispatch/api-error.log',
      out_file: '/var/log/buildersdispatch/api-out.log',
      log_file: '/var/log/buildersdispatch/api-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: 'n8n',
      script: 'n8n',
      args: 'start',
      cwd: '/root',
      instances: 1,
      exec_mode: 'fork',
      env: {
        N8N_HOST: 'localhost',
        N8N_PORT: 5678,
        N8N_PROTOCOL: 'http',
        N8N_BASIC_AUTH_ACTIVE: 'true',
        N8N_BASIC_AUTH_USER: 'admin',
        WEBHOOK_URL: 'https://buildersdispatch.com'
      },
      error_file: '/var/log/buildersdispatch/n8n-error.log',
      out_file: '/var/log/buildersdispatch/n8n-out.log',
      time: true,
      autorestart: true,
      max_memory_restart: '400M',
      min_uptime: '10s',
      max_restarts: 10
    }
  ],
  
  deploy: {
    production: {
      user: 'root',
      host: '72.60.117.91',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/buildersdispatch.git',
      path: '/var/www/buildersdispatch',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};