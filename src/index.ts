import { getLinks } from "./mail";
import playwright from "playwright";

getLinks((links) => {
	for(let i = 0; i < links.length; i++) {
		console.log(`Opening Link ${links[i]}`);
		(async () => {
			const browser = await playwright.chromium.launch();
			const page = await browser.newPage();
			await page.goto(links[i]);
			const cookieButton = ".cn-buttons > button";
			const cookieModal = await page.$(".cookie-modal");
			if(cookieModal) {
				console.log("Cookies!!");
				await page.waitForTimeout(200);
				await page.click(cookieButton);
			}
			await page.screenshot({path: 'example.png'});
			await browser.close();
		})();
	}
});