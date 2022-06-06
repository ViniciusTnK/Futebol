import Teams from '../database/models/team';

async function getAll() {
  try {
    return await Teams.findAll();
  } catch (error) {
    return { error };
  }
}

export default {
  getAll,
};
