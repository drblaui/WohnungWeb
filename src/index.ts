import { getLinks } from "./mail";
import playwright from "playwright";
import { gewobagAutoFill } from "./forms/gewobag";
import { degewoAutoFill } from "./forms/degewo";

getLinks((links) => {
	for(let i = 0; i < links.length; i++) {
		/*
			I am unsure but maybe some providers also
			use wohnungshelden, so maybe a check should be implemented later
		*/
		console.log(`Opening Link ${links[i]}`);
		(async () => {
			const browser = await playwright.chromium.launch();
			if(links[i].includes('wohnungshelden')) {
				//Could break if this is not unique for gewobag
				await gewobagAutoFill(browser, links[i]);
			}
			else if(links[i].includes('degewo')) {
				await degewoAutoFill(browser, links[i]);
			}
			await browser.close();
			console.log("Sent form");
		})();
	}
});