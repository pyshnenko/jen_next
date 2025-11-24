require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');

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

//
// Multer + CORS setup for uploads
//
const app = express();
// Allow browser to POST from Next dev server; allow credentials if needed
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// storage: destination depends on login + projectName
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // multer parses text fields only when using .fields or single with enctype multipart/form-data.
      // here body may be empty before multer handles it in some setups; use req.body (works with multer)
      let login = req.body.login || 'anonymous';
      let projectName = req.body.projectName || 'default';

      // sanitize to avoid traversal
      login = path.basename(String(login)).replace(/\s+/g, '_');
      projectName = path.basename(String(projectName)).replace(/\s+/g, '_');

      const uploadDir = path.join(process.cwd(), 'project', login, projectName);
      console.log(uploadDir)
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const name = `${Date.now()}_${safeName}`;
    cb(null, name);
  }
});

// limit size (example 100 MB)
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// existing endpoints use 'app' so moved below initialization of sequelize
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

  // routes
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

  // Upload endpoint: expects multipart/form-data with fields:
  // - login (string)
  // - projectName (string)
  // - file (file)
  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const login = path.basename(String(req.body.login || 'anonymous')).replace(/\s+/g, '_');
      const projectName = path.basename(String(req.body.projectName || 'default')).replace(/\s+/g, '_');

      // return saved path relative to server root
      const relativePath = path.join('project', login, projectName, req.file.filename);
      res.status(201).json({ message: 'Uploaded', path: `/${relativePath}`, filename: req.file.filename });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Upload error:', err);
      res.status(500).json({ error: String(err) });
    }
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Local API server (MySQL) listening on http://localhost:${PORT}`);
  });
}

start();