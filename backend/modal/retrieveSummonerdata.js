/* eslint-disable linebreak-style */
import pool from './mysqlConnector.js';

const query = 'select * from leagueranks  where record is not NULL';
const getAllSummonerData = async () => {
  const [response] = await pool.query(query);
  return response;
};

export default getAllSummonerData;
