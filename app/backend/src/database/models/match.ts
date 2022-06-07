import { Model, DataTypes } from 'sequelize';
import db from '.';
import { MatchInterface } from '../../interface/modelsInterfaces';
import Team from './team';

class Match extends Model implements MatchInterface {
  public id: number;
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

// ? is this the right way to do when using eager loading?
// ? how should make the association Team.HasMany(Match), i can't see the solution
Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'matchesAway' });
Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'matchesHome' });
Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Match;
