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

		const data = await Promise.all(newsLink.map(async (link)=>{
			try{
				const res = await superagent.get(link);
				const $ = cheerio.load(res.text);

				const newsAuthor = $('.detail__author').map((i, section)=>{
					const author = $(section).text();
					return author;

				}).get();

				const releaseDate = $('.detail__date').map((i, section)=>{
					return $(section).text();

				}).get();

				return {
					newsAuthor,
					releaseDate
				}

			} catch(err) {
				console.log(err);
			}
		}));

		data.forEach((val, index)=>{
			let object = new Object();

			const author = val.newsAuthor;
			const date = val.releaseDate;

			object.newsTitle = newsTitle[index];
			object.author = author[0];
			object.newsLink = newsLink[index];

			console.log(object)
			

		})

	} catch (err) {
		console.log(err);

	};
})();