const Parser = require('rss-parser');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const parser = new Parser();

const FEED_URL = 'https://offthecusp.com/feed';

/**
 * Extract og:image or twitter:image from a webpage's metadata
 * @param {string} url
 * @returns {Promise<string|null>}
 */
async function getImageFromMetadata(url) {
  try {
    const response = await fetch(url, { timeout: 10000 });
    const html = await response.text();
    const $ = cheerio.load(html);

    const ogImage = $('meta[property="og:image"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');

    return ogImage || twitterImage || null;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch metadata image from ${url}: ${err.message}`);
    return null;
  }
}

async function fetchDentalNews() {
  try {
    const feed = await parser.parseURL(FEED_URL);

    console.log(`📰 Source: ${feed.title}`);
    console.log('--------------------------------------------------');

    for (const [index, item] of feed.items.entries()) {
        const imageUrl = await getImageFromMetadata(item.link);

        console.log(`📌 Article ${index + 1}`);
        console.log(`GUID      : ${item.guid}`);
        console.log(`Title     : ${item.title}`);
        console.log(`Link      : ${item.link}`);
        console.log(`Author    : ${item.creator || 'N/A'}`);
        console.log(`Published : ${item.pubDate}`);
        console.log(`Category  : ${item.categories?.join(', ') || 'None'}`);
        console.log(`Summary   : ${item.contentSnippet || 'No summary available'}`);
        console.log(`Image URL : ${imageUrl || 'No image found in metadata'}`);
        console.log('--------------------------------------------------\n');
      }
  } catch (error) {
    console.error('❌ Error fetching feed:', error.message);
  }
}

fetchDentalNews();
