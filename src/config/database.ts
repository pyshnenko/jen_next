import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: String(process.env.SQLDB),      // Имя вашей базы данных
  username: String(process.env.SQLUSER),    // Имя пользователя MySQL
  password: String(process.env.SQLPASS),    // Пароль пользователя MySQL
  host: String(process.env.SQLHOST),        // Хост вашей базы данных (например, 'localhost' или IP)
  dialect: 'mysql',                         // Используемый диалект базы данных
  port: Number(process.env.SQLPORT),        // Порт MySQL
  logging: false,                           // Отключить логирование SQL-запросов в консоль
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    freezeTableName: true                   // Запретить Sequelize изменять имена таблиц (например, 'User' -> 'Users')
  }
});

export default sequelize;