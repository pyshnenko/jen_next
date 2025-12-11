require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');
const unzipper = require('unzipper');

const PORT = process.env.LOCAL_API_PORT ? Number(process.env.LOCAL_API_PORT) : 4001;

// ✅ ОСТАВЛЯЕМ /var/www/html, но строго контролируем
const PUBLIC_BASE = '/var/www/html'; // Публичная директория
const UPLOAD_DIR = 'project'; // Поддиректория: /var/www/html/project

// --- Проверка существования ---
if (!fs.existsSync(path.join(PUBLIC_BASE, UPLOAD_DIR))) {
  fs.mkdirSync(path.join(PUBLIC_BASE, UPLOAD_DIR), { recursive: true });
}

// --- Подключение к БД ---
const mysql2 = require('mysql2');

const DB_NAME = process.env.SQLDB;
const DB_USER = process.env.SQLUSER;
const DB_PASS = process.env.SQLPASS;
const DB_HOST = process.env.SQLHOST || 'localhost';
const DB_PORT = process.env.SQLPORT || 3306;

if (!DB_NAME || !DB_USER) {
  console.error('❌ Database name or user not provided. Set SQLDB/SQLUSER in .env');
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

// --- Модели ---
const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  project_access: { type: DataTypes.INTEGER },
  project_name: { type: DataTypes.STRING },
  project_url: { type: DataTypes.STRING },
  user_login: { type: DataTypes.STRING },
}, {
  tableName: 'projects',
  timestamps: true,
  freezeTableName: true,
});

const User = sequelize.define('User', {
  Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  login: { type: DataTypes.STRING(100), allowNull: false },
  hash: { type: DataTypes.STRING(250), allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: true },
  lastname: { type: DataTypes.STRING(100), allowNull: true },
  access: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  folder: { type: DataTypes.STRING(100), allowNull: true },
  project: { type: DataTypes.STRING(100), allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
  freezeTableName: true,
});

// --- Санитизация ---
function sanitize(input) {
  return String(input)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 50);
}

// --- Multer: сохраняем в /var/www/html/project/login/projectName ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const login = sanitize(req.body.login || 'anonymous');
    const projectName = sanitize(req.body.projectName || 'default');

    const uploadDir = path.join(PUBLIC_BASE, UPLOAD_DIR, login, projectName);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}_${sanitize(file.originalname)}`;
    cb(null, name);
  }
});

// 🔐 Фильтрация: только безопасные расширения
const ALLOWED_EXTS = ['.ip'];

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ALLOWED_EXTS.includes(ext)) {
    cb(null, true);
  } else {
    console.warn('Blocked unsafe file type:', ext, 'from', file.originalname);
    cb(new Error(`Недопустимое расширение: ${ext}. Разрешено: ${ALLOWED_EXTS.join(', ')}`), false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 50 MB
  fileFilter
});

// --- Express ---
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Маршруты ---

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

app.put('/access', async (req, res) => {
  const { login, acc } = req.body;
  if (!login || acc === undefined) return res.status(400).json({ error: 'Missing login or acc' });
  try {
    await User.update({ access: acc }, { where: { login } });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.get('/projects/:login', async (req, res) => {
  try {
    const { login } = req.params;
    const user = await User.findOne({ attributes: ['access'], where: { login }, raw: true });
    const projects = await Project.findAll({
      where: user?.access > 10 ? {} : { user_login: login },
      attributes: ['id', 'project_name', 'project_url', 'createdAt', 'user_login'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { Id, ...userData } = req.body;
    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Create failed' });
  }
});

// ✅ Загрузка: безопасная распаковка в /var/www/html/project/...
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const login = sanitize(req.body.login || 'anonymous');
  const projectName = sanitize(req.body.projectName || 'default');
  const extractPath = path.join(PUBLIC_BASE, UPLOAD_DIR, login, projectName);

  fs.mkdirSync(extractPath, { recursive: true });

  console.log(`Extracting ${req.file.path} → ${extractPath}`);

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', resolve)
        .on('error', err => {
          console.error('Unzip error:', err);
          reject(err);
        });
    });

    fs.unlinkSync(req.file.path);

    // ✅ Проверка: есть ли index.html?
    const indexPath = path.join(extractPath, 'index.html');
    const hasIndex = fs.existsSync(indexPath);
    const projectUrl = hasIndex
      ? `/project/${login}/${projectName}/index.html`
      : `/project/${login}/${projectName}/`;

    await Project.upsert({
      project_access: 1,
      project_name: projectName,
      project_url: projectUrl,
      user_login: login,
    });

    res.status(201).json({
      message: 'OK',
      project: { project_name: projectName, project_url: projectUrl, user_login: login }
    });

  } catch (err) {
    console.error('Extract failed:', err);
    res.status(500).json({ error: 'Extract failed', details: err.message });
  }
});

// Удаление
app.delete('/project', async (req, res) => {
  const { login: rawLogin, projectName: rawProjectName } = req.body || {};
  if (!rawLogin || !rawProjectName) return res.status(400).json({ error: 'Missing login or projectName' });

  const login = sanitize(rawLogin);
  const projectName = sanitize(rawProjectName);
  const projectPath = path.join(PUBLIC_BASE, UPLOAD_DIR, login, projectName);

  try {
    const project = await Project.findOne({
      where: { user_login: login, project_name: projectName }
    });

    if (!project) return res.status(403).json({ error: 'Not found or forbidden' });

    await Project.destroy({ where: { id: project.id } });

    if (fs.existsSync(projectPath)) {
      await fs.promises.rm(projectPath, { recursive: true, force: true });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- Запуск ---
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL connected');
  } catch (err) {
    console.error('❌ DB error:', err);
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Projects: http://ваш-сайт/project/{login}/{projectName}/`);
  });
}

start();

process.once('SIGINT', () => console.log('🛑 Stopping...'));
process.once('SIGTERM', () => console.log('🛑 Terminating...'));
