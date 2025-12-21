module.exports = {
  apps: [
    {
      args: "start",
      cwd: "/Users/server/www/hey.xyz",
      env: {
        NODE_ENV: "production"
      },
      max_restarts: 10,
      name: "hey.xyz",
      restart_delay: 4000,
      script: "/Users/server/.nvm/versions/node/v22.21.1/bin/pnpm"
    }
  ]
};
