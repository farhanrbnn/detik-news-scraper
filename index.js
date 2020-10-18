const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.detik.com/terpopuler/news?utm_source=detiknews&utm_medium=desktop&_ga=2.23191481.2037223770.1602988903-174572001.1602988903';
let arrToJson = [];
let objectToJson = new Object();

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

				const relateNewsLink = $('.list-content__title').map((i, section)=>{
					const link =  $(section).find('a');
					return link.attr('href');

				}).get();

				const relateNewsTitle = $('.list-content__title').map((i, section)=>{
					const title = $(section).find('a');
					return title.text();

				}).get();

				// console.log(relateNewsTitle)

				return {
					newsAuthor,
					releaseDate,
					relateNewsLink,
					relateNewsTitle
				}

			} catch(err) {
				console.log(err);
			}
		}));

		data.forEach((val, index)=>{
			let object = new Object();
			let arr = []

			const author = val.newsAuthor;
			const date = val.releaseDate;
			const relateNewsTitle = val.relateNewsTitle;
			const relateNewsLink = val.relateNewsLink;

			relateNewsTitle.forEach((val, index)=>{
				let object = new Object();

				object.newsTitle = val
				object.newsLink = relateNewsLink[index]

				arr.push(object)
			});

			object.newsTitle = newsTitle[index];
			object.author = author[0];
			object.newsLink = newsLink[index];
			object.relateNews = arr;

			arrToJson.push(object);
			
		});

		objectToJson.news = arrToJson;
		const saveToJson = JSON.stringify(objectToJson, null, 4);
		
		fs.writeFile('result.json', saveToJson, 'utf8', (err)=>{
			if(err) {
				console.log(err);
			} else {
				console.log('scraping done')
			};
		});

	} catch (err) {
		console.log(err);

	};
})();