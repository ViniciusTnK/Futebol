import { Model, DataTypes } from 'sequelize';
import db from '.';

class Team extends Model {}

Team.init({
  teamName: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, {
  tableName: 'teams',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

export default Team;
