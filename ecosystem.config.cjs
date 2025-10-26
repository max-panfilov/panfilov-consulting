module.exports = {
  apps: [
    {
      name: 'panfilov-consulting',
      script: 'pnpm',
      args: 'start',
      cwd: '/home/nodejs/panfilov-consulting',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
  ],
};
