require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');
const yauzl = require('yauzl');

const PORT = process.env.LOCAL_API_PORT ? Number(process.env.LOCAL_API_PORT) : 4001;
const BASE_PATH = '/var/www/html/';//process.env.PROJECT_DIR || process.cwd();//
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

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  project_access: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_login: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'projects',
  timestamps: true,
  freezeTableName: true,
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

      const uploadDir = path.join(BASE_PATH, 'project', login, projectName);
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
  app.put(`/access`, async (req, res) => {
    const { login, acc } = req.body;
    await User.update({
      access: acc
    }, {
      where: { login: login }
    })
    res.status(200).json({})
  });
app.get('/projects/:login', async (req, res) => {
  try {
    const { login } = req.params;
    const userPermissions = await User.findOne({
      attributes: ['access'],
      where: { login },
      raw: true,
    });
    const projects = await Project.findAll({
      where: userPermissions.access > 10 ? {} : { user_login: login },
      attributes: ['id', 'project_name', 'project_url', 'createdAt', 'user_login'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});
  app.post('/users', async (req, res) => {
    try {
      const { Id, ...userData } = req.body;
      const created = await User.create(userData);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // Upload endpoint: expects multipart/form-data with fields:
  // - login (string)
  // - projectName (string)
  // - file (file)
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('upload')
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const login = path.basename(String(req.body.login || 'anonymous')).replace(/\s+/g, '_');
    const projectName = path.basename(String(req.body.projectName || 'default')).replace(/\s+/g, '_');

    const uploadDir = path.join(BASE_PATH, 'project', login, projectName);

    // Убедимся, что папка существует
    fs.mkdirSync(uploadDir, { recursive: true });

    // Открываем ZIP-архив
    yauzl.open(req.file.path, { lazyEntries: true }, (err, zipfile) => {
      if (err || !zipfile) {
        return res.status(500).json({ error: 'Failed to open ZIP file' });
      }

      zipfile.readEntry();

      zipfile.on('end', () => {
        // Удаляем zip после распаковки
        fs.unlink(req.file.path, () => {}); // не критично

        // Проверяем наличие index.html в распакованной папке
        const indexPath = path.join(uploadDir, 'index.html');
        const hasIndexHtml = fs.existsSync(indexPath);
        const projectUrl = hasIndexHtml
          ? `/project/${login}/${projectName}/index.html`
          : `/project/${login}/${projectName}/`;

        // Сохраняем или обновляем запись
        Project.upsert({
          project_access: 1,
          project_name: projectName,
          project_url: projectUrl,
          user_login: login,
        })
          .then(([project]) => {
            res.status(201).json({
              message: 'Archive extracted and project saved',
              project: {
                id: project.id,
                project_name: project.project_name,
                project_url: project.project_url,
                user_login: project.user_login,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({ error: 'Failed to save project', details: err.message });
          });
      });

      zipfile.on('entry', (entry) => {
        // Пропускаем директории
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }

        // Извлекаем путь без корневой папки
        const parts = entry.fileName.split('/');
        let relativePath;

        // Если первый элемент — папка, а остальное — файл, например: "my-site/index.html"
        if (parts.length > 1) {
          // Берём всё, кроме первой папки
          relativePath = path.join(...parts.slice(1));
        } else {
          // Просто файл в корне архива
          relativePath = entry.fileName;
        }

        // Полный путь назначения
        const fullPath = path.join(uploadDir, relativePath);
        const dir = path.dirname(fullPath);

        // Создаём папки при необходимости
        fs.mkdirSync(dir, { recursive: true });

        // Поток чтения
        zipfile.openReadStream(entry, (err, readStream) => {
          if (err) {
            console.error('Error reading entry:', err);
            return zipfile.readEntry();
          }

          const writeStream = fs.createWriteStream(fullPath);
          readStream.pipe(writeStream);

          writeStream.on('close', () => {
            zipfile.readEntry();
          });

          writeStream.on('error', (err) => {
            console.error('Write stream error:', err);
            zipfile.readEntry();
          });
        });
      });

      zipfile.on('error', (err) => {
        console.error('ZIP error:', err);
        res.status(500).json({ error: 'Error extracting archive', details: err.message });
      });
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// New DELETE /project -> deletes DB record and removes physical folder
app.delete('/project', async (req, res) => {
  try {
    const { login: rawLogin, projectName: rawProjectName } = req.body || {};

    if (!rawLogin || !rawProjectName) {
      return res.status(400).json({ error: 'Missing login or projectName' });
    }

    // sanitize inputs to avoid traversal
    const login = path.basename(String(rawLogin)).replace(/\s+/g, '_');
    const projectName = path.basename(String(rawProjectName)).replace(/\s+/g, '_');

    // find project owned by the user
    const project = await Project.findOne({
      where: { user_login: login, project_name: projectName },
    });

    if (!project) {
      // 403 — forbidden / not found (as requested)
      return res.status(403).json({ error: 'Project not found or forbidden' });
    }

    // delete DB record
    const deletedRows = await Project.destroy({
      where: { id: project.id },
    });

    if (!deletedRows) {
      console.error('Failed to delete project from DB', project.id);
      return res.status(500).json({ error: 'Failed to delete project in database' });
    }

    // physically remove folder
    const uploadDir = path.join(BASE_PATH, 'project', login, projectName);

    try {
      // remove recursively (Node 14+ supports fs.promises.rm)
      if (fs.existsSync(uploadDir)) {
        await fs.promises.rm(uploadDir, { recursive: true, force: true });
      }
    } catch (err) {
      // DB already deleted — log the issue and respond 500
      console.error('Failed to remove project directory:', uploadDir, err);
      return res.status(500).json({ error: 'Project deleted from DB but failed to remove directory', details: String(err) });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Delete /project error:', err);
    return res.status(500).json({ error: String(err) });
  }
});

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Local API server (MySQL) listening on http://localhost:${PORT}`);
  });
}

start();