import { Model, DataTypes } from 'sequelize';
import db from '.';
import Team from './team';

class Match extends Model {}

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
    type: DataTypes.NUMBER,
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
