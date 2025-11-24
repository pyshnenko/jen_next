import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Добавляем конфигурацию Webpack для Sequelize и драйверов, чтобы не бандлить их в серверный билд
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pg-hstore': 'pg-hstore',
        'sqlite3': 'sqlite3',
        'tedious': 'tedious',
        'pg': 'pg',
        'mysql2': 'mysql2',
        'mariadb': 'mariadb'
      });
    }
    return config;
  },
};

export default nextConfig;
