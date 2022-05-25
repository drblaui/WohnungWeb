import Imap from 'imap';
import fs from 'fs';
import {
	inspect
} from 'util';
import {
	parse
} from 'node-html-parser'
import {
	Stream
} from 'nodemailer/lib/xoauth2';
require('dotenv').config();

const linkRegexes = [
	/https:\/\/app.wohnungshelden.de\/\d*\/\d*\/property\/application\/form\/\d*\/\d*\/\d*/g
];

export function getLinks(callback: ((arg0: RegExpMatchArray) => void)) {
	let links: RegExpMatchArray =[];
	let done = false;
	let imap = new Imap({
		user: process.env.MAIL_USER || '',
		password: process.env.MAIL_PASS || '',
		host: process.env.MAIL_IMAP_HOST || '',
		port: parseInt(process.env.MAIL_IMAP_PORT || '0'),
		tls: process.env.MAIL_TLS === "true"
	});
	imap.once('ready', () => {
		imap.status('Wohnung', (err, status) => {
			if (err) throw err;
			if (status.messages.unseen === 0) {
				console.log("Nothing new");
				imap.end();
			}
		});
		imap.openBox('Wohnung', true, (err, box) => {
			if (err) throw err;
			imap.search(['UNSEEN'], (err, res) => {
				if (err) throw err;

				//Gets all body text
				let f = imap.fetch(res, {
					bodies: 'TEXT'
				});

				f.on('message', (msg, _seqno) => {
					msg.on('body', (stream, _info) => {
						let buffer = '';

						stream.on('data', (chunk) => {
							buffer += chunk.toString('utf8');
						});

						stream.once('end', () => {
							//Hack, because encoding creates =\n and breaks chunks
							buffer = buffer.replaceAll(/\s|=/g, '');

							linkRegexes.forEach((regex) => {
								let matches = buffer.match(regex);
								if (matches) {
									matches = removeDuplicates(matches);
									links = links.concat(matches);
								}
							})
						})
					})
				});
				f.once('end', () => {
					imap.end();
					callback(links);
					done = true;
				});
			});
		});
	});
	
	imap.once('error', (err: Error) => {
		console.log(err);
	});
	imap.connect();
}

//TODO: Generic?
function removeDuplicates(list: RegExpMatchArray): RegExpMatchArray {
	return Array.from(new Set(list));
}