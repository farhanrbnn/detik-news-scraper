const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.detik.com/terpopuler/news?utm_source=detiknews&utm_medium=desktop&_ga=2.23191481.2037223770.1602988903-174572001.1602988903';

(async ()=>{
	try{
		const res = await superagent.get(URL);
		const $ = cheerio.load(res.text);

		const newsLink = $('.media__title').map((i, section)=>{
			const link = $(section).find('a');
			return link.attr('href');

		}).get();	

		const newsTitle = $('.media__title').map((i, section)=>{
			const title = $(section).find('a');
			return title.text();

		}).get();

		console.log(newsTitle);
		
	} catch (err) {
		console.log(err);

	};
})();