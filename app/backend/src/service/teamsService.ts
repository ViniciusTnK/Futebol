import { notFound } from '../errorMessages';
import Teams from '../database/models/team';

async function getAll() {
  try {
    return await Teams.findAll();
  } catch (error) {
    return { error };
  }
}

async function getTeam(id: string) {
  try {
    const team = await Teams.findOne({ where: { id } });

    if (team === null) return notFound('team');

    return team;
  } catch (error) {
    return { error };
  }
}

export default {
  getAll,
  getTeam,
};
