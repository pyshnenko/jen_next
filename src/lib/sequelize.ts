// Переписал файл на ленивую (runtime) инициализацию, чтобы избежать проблем с бандлингом sequelize/mysql2.
// Экспортируем функцию initSequelize(), которая создаёт Sequelize, инициализирует модели и возвращает объекты.
import type { Sequelize as SequelizeType, ModelCtor } from 'sequelize';

/**
 * Lazy runtime initialization of Sequelize.
 * Tries to use mysql2 (or mariadb) if available; otherwise falls back to sqlite for local dev.
 */
let _state: any = {};

export async function initSequelize() {
  if (_state.sequelize && _state.syncDatabase) return _state;

  // require динамически, чтобы Webpack не пытался бандлить драйверы
  const { Sequelize } = require('sequelize');

  // конфигурация из env
  const DB_DIALECT = (process.env.DB_DIALECT || 'mysql').toLowerCase();
  const DB_NAME = process.env.SQLDB || 'devdb';
  const DB_USER = process.env.SQLUSER || 'root';
  const DB_PASS = process.env.SQLPASS || '';
  const DB_HOST = process.env.SQLHOST || 'localhost';
  const DB_PORT = parseInt(process.env.SQLPORT || (DB_DIALECT === 'mysql' ? '3306' : '0'), 10);

  let dialect = DB_DIALECT;
  let dialectModule: any = undefined;

  // попытка подключить нужный драйвер (mysql2/mariadb). если не найден — fallback на sqlite
  try {
    if (dialect === 'mysql' || dialect === 'mariadb') {
      dialectModule = require('mysql2');
    }
  } catch (err) {
    // не установлен mysql2 — перейдём на sqlite для dev
    // eslint-disable-next-line no-console
    console.warn('[initSequelize] mysql2 not available, falling back to sqlite for dev:', String(err));
    dialect = 'sqlite';
  }

  const commonOptions: any = {
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: { freezeTableName: true },
  };

  let sequelize: any;
  if (dialect === 'sqlite') {
    const storage = process.env.DB_SQLITE_FILE || 'dev.sqlite';
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage,
      ...commonOptions,
    });
  } else {
    const options: any = {
      host: DB_HOST,
      port: DB_PORT || undefined,
      dialect,
      ...commonOptions,
    };
    if (dialectModule) options.dialectModule = dialectModule;
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, options);
  }

  // инициализация моделей динамически
  try {
    const UserModule = require('./models/users').default;
    if (UserModule && typeof UserModule.initModel === 'function') {
      UserModule.initModel(sequelize);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[initSequelize] модель users не инициализирована автоматически:', String(err));
  }

  let synced = false;
  const syncDatabase = async () => {
    if (synced) return;
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      synced = true;
      // eslint-disable-next-line no-console
      console.log('Database synchronized');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('DB sync error', err);
      throw err;
    }
  };

  _state = { sequelize, syncDatabase };
  return _state;
}