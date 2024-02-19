/* eslint-disable linebreak-style */
import getAllSummonerData from '../modal/retrieveSummonerdata.js';
import UpdateSummoner from '../modal/updateSummonerRank.js';
import ScrapeProduct from '../webscrape/leagueStatswebscrape.js';

const matchresposne = (oldPlayer, newPlayerData) => {
  const oldWinRate = parseFloat(oldPlayer.winrate.replace('%', ''));
  const newWinRate = parseFloat(newPlayerData[3].replace('%', ''));

  const oldLp = parseInt(oldPlayer.LeaguePoints.replace('LP', ''), 10);
  const newLp = parseInt(newPlayerData[1].replace('LP', ''), 10);

  // IF newWinRate is greater then it means they won
  if (newWinRate > oldWinRate) {
    if (newLp > oldLp) { // newLp is greater then the old that means they're in the same tier and gain Lp
      return `${oldPlayer.SummonerName} has won a match and has gain ${newLp - oldLp}LP!\n Their current standing is ${newPlayerData[0]} ${newLp}Lp`;
    } // if newLp is lower it means that they have promoted
    return `${oldPlayer.SummonerName} has won a match and has been promoted to ${newPlayerData[0]}\n Their current standing is ${newPlayerData[0]} ${newLp}Lp`;
  } // when newWinRate is lower then the old means they  lost
  if (newLp <= oldLp) { // if newlp is less than old means theyre in the same tier and lost lp
    return `${oldPlayer.SummonerName} has lost a match and has lost ${oldLp - newLp}LP\n Their current standing is ${newPlayerData[0]} ${newLp}Lp`;
  }

  return `${oldPlayer.SummonerName} has lost a match and has been demoted to ${newPlayerData[0]}\n Their current standing is ${newPlayerData[0]} ${newLp}Lp`;
};

const didSummonerWinOrLose = async (channel) => {
  try {
    console.log('2 minutes have passed');
    const players = await getAllSummonerData();

    players.forEach(async (player) => {
      const newPlayerData = await ScrapeProduct(player.SummonerName);
      if (player.winrate !== newPlayerData[3]) {
        UpdateSummoner(player.SummonerName, newPlayerData);
        console.log(`${player.SummonerName} has finished a match`);
        // if (channel && channel.isText()) {
        // console.log('i got inside channel if statement');
        await channel.send(matchresposne(player, newPlayerData));
        // }
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export default didSummonerWinOrLose;
