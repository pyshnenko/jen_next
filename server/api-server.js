require('dotenv').config();

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const PORT = process.env.LOCAL_API_PORT ? Number(process.env.LOCAL_API_PORT) : 4001;

// --- Strict MySQL-only setup (no sqlite fallback) ---
let mysql2;
try {
  mysql2 = require('mysql2');
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('mysql2 is required but not installed. Run: npm i mysql2');
  process.exit(1);
}
const DB_NAME = process.env.SQLDB;
const DB_USER = process.env.SQLUSER;
const DB_PASS = process.env.SQLPASS;
const DB_HOST = process.env.SQLHOST;
const DB_PORT = process.env.SQLPORT;
console.log(DB_NAME);

if (!DB_NAME || !DB_USER) {
  // eslint-disable-next-line no-console
  console.error('Database name or user not provided. Set SQLDB/SQLUSER (or DB_NAME/DB_USER) in .env');
  process.exit(1);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: false,
  define: { freezeTableName: true },
});

// модель User (схема соответствует src/lib/models/users.ts)
const User = sequelize.define('User', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  login: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  hash: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  access: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  folder: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  project: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  freezeTableName: true,
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // eslint-disable-next-line no-console
    console.log('Local API MySQL connected and synced');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect or sync MySQL:', err);
    process.exit(1);
  }

  const app = express();
  app.use(express.json());

  app.get('/users', async (req, res) => {
    try {
      const rows = await User.findAll();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.post('/users', async (req, res) => {
    try {
        const { Id, ...userData } = req.body;

        const created = await User.create(userData);
        res.status(201).json(created);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: String(err) });
    }
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Local API server (MySQL) listening on http://localhost:${PORT}`);
  });
}

start();