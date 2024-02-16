/* eslint-disable linebreak-style */
import pool from './mysqlConnector.js';

const registersummoner = async (summonerName, rankDetails) => {
  await pool.query('INSERT INTO leagueranks(SummonerName,rankTier,LeaguePoints,record,winrate) VALUES(?,?,?,?,?)', [summonerName, rankDetails[0], rankDetails[1], rankDetails[2], rankDetails[3]]);
};

export default registersummoner;
