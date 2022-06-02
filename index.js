const rp = require('request-promise');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const ObjectsToCsv = require('objects-to-csv');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
// const url = 'https://www.141jav.com/new';
app.get('/', async (req, res) => {
	const start = req.query?.start || 0;
	const end = req.query?.end || 3;
	const host =
		req.query?.host == 'jav'
			? `https://www.141jav.com/new?page=`
			: `https://www.141ppv.com/new?page=`;
	console.log({ start }, { end });
	const url = (index) => {
		return `${host}${index}`;
	};

	try {
		let data = [];
		for (let j = parseInt(start); j < parseInt(end); j++) {
			console.log('test', url(j + 1));
			const html = await rp(url(j + 1));
			const dom = new JSDOM(`${html}`);
			var arr = [],
				l = dom.window.document.links;
			for (var i = 0; i < l.length; i++) {
				arr.push(l[i].href);
			}
			console.log({ arr });
			const needArr = arr.filter((item) => item.includes('magnet:'));
			// console.log({ needArr });
			data = [...data, ...needArr];
		}
		const mapping = data.map((item, index) => {
			return { url: item };
		});
		// console.log({ data });
		const csv = new ObjectsToCsv(mapping);
		await csv.toDisk('./test.csv');
		console.log('path', path.join(__dirname, 'test.csv'));
		res.sendFile(path.join(__dirname, 'test.csv'), function (err) {
			if (err) {
			} else {
			}
		});
	} catch (e) {
		console.log({ e });
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
