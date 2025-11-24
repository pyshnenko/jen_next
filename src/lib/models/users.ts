import { DataTypes, Model, Optional, Sequelize } from 'sequelize'; // Добавляем Sequelize в импорт

// Интерфейс для атрибутов модели User
export interface UserAttributes { // Экспортируем интерфейс для использования в API роутах
  Id: number;
  login: string;
  hash: string;
  name: string;
  lastname: string;
  access: number;
  folder: string;
  project: string;
}

// Интерфейс для входных данных при создании пользователя
export interface UserCreationAttributes extends Optional<UserAttributes, 'Id'> {}

// Класс модели User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public Id!: number;
  public login!: string;
  public hash!: string;
  public name!: string;
  public lastname!: string;
  public access!: number;
  public folder!: string;
  public project!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Статический метод для инициализации модели, который принимает экземпляр Sequelize
  public static initModel(sequelize: Sequelize): void {
    User.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        login: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
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
      },
      {
        tableName: 'users',
        sequelize, // Передаем экземпляр Sequelize
        timestamps: true,
        underscored: false,
      }
    );
  }
}

export default User;