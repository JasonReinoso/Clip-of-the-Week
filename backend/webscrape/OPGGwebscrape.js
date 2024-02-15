/* eslint-disable linebreak-style */
import puppeteer from 'puppeteer';

const url = 'https://www.op.gg/summoners/na/';

const ScrapeProduct = async (summonerName) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });
  const newURL = `${url}koybe-na1`;
  await page.goto(newURL);

  await page.screenshot({ path: 'test.png', fullPage: true });

  const html = await page.content();
  console.log(html);

  browser.close();
};

ScrapeProduct('s');
