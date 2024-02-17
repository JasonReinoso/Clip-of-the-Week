/* eslint-disable linebreak-style */
import getAllSummonerData from '../modal/retrieveSummonerdata.js';
import UpdateSummoner from '../modal/updateSummonerRank.js';
import ScrapeProduct from '../webscrape/leagueStatswebscrape.js';

// const checkplayer = async (players) ={
//     players.for
// }

const didSummonerWinOrLose = async (channel, pollingInterval) => {
  try {
    const players = await getAllSummonerData();

    players.forEach(async (player) => {
      const newPlayerData = await ScrapeProduct(player.SummonerName);
      if (player.winrate !== newPlayerData[3]) {
        UpdateSummoner(player.SummonerName, newPlayerData);
        if (channel && channel.isText()) {
          await channel.send(`${player} has finished a match`);
        }
      }
    });
  } catch (e) {
    console.log(e);
  } finally {
    await setTimeout(await didSummonerWinOrLose(channel, pollingInterval), pollingInterval);
  }
};

// didSummonerWinOrLose();
export default didSummonerWinOrLose;
