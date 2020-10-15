const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.youtube.com/feed/trending';

(async ()=>{
	try{
		const res = await superagent.get(URL);
		const $ = cheerio.load(res.text);

		console.log($);

	} catch (err) {
		console.log(err);

	};
})();