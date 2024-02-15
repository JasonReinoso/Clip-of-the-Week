/* eslint-disable linebreak-style */
import puppeteer from 'puppeteer';

const ScrapeProduct = async (summonerName) => {
  const url = 'https://www.op.gg/summoners/na/';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });
  summonerName = summonerName.replace('#', '-');
  console.log(summonerName);
  const newURL = `${url}${summonerName}`;
  await page.goto(newURL);

  // await page.screenshot({ path: 'test.png', fullPage: true });

  const divContent = await page.evaluate(() => {
    const element = document.evaluate('/html/body/div[1]/div[7]/div[1]/div[1]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element.innerText;
  });

  const summonerDetails = divContent.split('\n');

  browser.close();

  return summonerDetails;
};

// var startTune = performance.now();
// await ScrapeProduct('s');
// var endTime= performance.now();

// console.log(endTime-startTune);
export default ScrapeProduct;
