import { Model, DataTypes } from 'sequelize';
import db from '.';
import { TeamInterface } from '../../interface/modelsInterfaces';

class Team extends Model implements TeamInterface {
  public id: number;
  public teamName: string;
}

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
