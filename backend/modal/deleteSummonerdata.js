/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import pool from './mysqlConnector.js';

const deleteSummoner = (summonerName) => {
    summonerName = summonerName.replace('-', '#');
  const query = 'DELETE FROM leagueranks where SummonerName = ?';
  pool.query(query, summonerName);
};

export default deleteSummoner;