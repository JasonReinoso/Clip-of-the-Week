/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import pool from './mysqlConnector.js';

const UpdateSummoner = (summonerName, SummonerRankDetail) => {
  const query = 'update leagueranks SET rankTier = ?, LeaguePoints = ?, record = ?, winrate = ? where SummonerName=?';
  pool.query(query, [SummonerRankDetail[0], SummonerRankDetail[1], SummonerRankDetail[2], SummonerRankDetail[3], summonerName]);
};

export default UpdateSummoner;
