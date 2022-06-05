import { Model, DataTypes } from 'sequelize';
import db from '.';
import { UserInterface } from '../../interface/modelsInterfaces';

class User extends Model implements UserInterface {
  public id: number;
  public role: string;
  public email: string;
  public password: string;
  public username: string;
}

User.init({
  username: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, {
  tableName: 'users',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

export default User;
