/* eslint-disable linebreak-style */
import puppeteer from 'puppeteer';

const ScrapeProduct = async (summonerName) => {
  const url = 'https://leaguestats.gg/summoner/na/';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });
  summonerName = summonerName.replace('#', '-');
  console.log(summonerName);
  const newURL = `${url}${summonerName}`;
  await page.goto(newURL, { waitUntil: 'networkidle0' });

  const divContent = await page.evaluate(() => {
    const element = document.evaluate('/html/body/div[1]/div[4]/div[2]/div[1]/div[1]/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element.innerText;
  });

  const summonerDetails = divContent.split('\n');
  if (summonerDetails.includes('Flex 5vs5')) summonerDetails.splice(3, 1);
  const cleanSummonerDetail = [summonerDetails[0], summonerDetails[1], `${summonerDetails[3]} ${summonerDetails[4]}-${summonerDetails[6]}`, `${summonerDetails[8]}`];
  browser.close();

  return cleanSummonerDetail;
};

// const startTune = performance.now();
// await ScrapeProduct('koybe#na1');
// const endTime = performance.now();

// console.log(endTime-startTune);
export default ScrapeProduct;
