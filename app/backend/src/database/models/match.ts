import { Model, DataTypes } from 'sequelize';
import db from '.';
import Team from './team';
import { MatchInterface } from '../../interface/modelsInterfaces';

class Match extends Model implements MatchInterface {
  public homeTeam: number;
  public homeTeamGoals: number;
  public awayTeam: number;
  public awayTeamGoals: number;
  public inProgress: boolean;
}

Match.init({
  homeTeam: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  homeTeamGoals: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  awayTeam: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  awayTeamGoals: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  inProgress: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
}, {
  tableName: 'matches',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'matches' });
Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'homeTeam' });

Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'matches' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'homeTeam' });

export default Match;
