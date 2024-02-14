Create database LeagueStats;
use leaguestats;

Create table LeagueRanks (

SummonerName varchar(255),
rankTier varchar(50),
LeaguePoints int,
winrate varchar(255),

primary key (SummonerName)
);


