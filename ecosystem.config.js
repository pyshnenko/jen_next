module.exports = {
  apps : [
    {
      name: "client",
      script: "npm",
      args: "start",
      // Другие опции PM2, например, env-переменные, логирование и т.д.
    },
    {
      name: "server",
      script: "npm",
      args: "run local-api",
      // Другие опции PM2
    }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
