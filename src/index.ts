import { getLinks } from "./mail";
import playwright from "playwright";
import formInfo from "./env_handler";

getLinks((links) => {
	for(let i = 0; i < links.length; i++) {
		/*
			I am unsure but maybe some providers also
			use wohnungshelden, so maybe a check should be implemented later
		*/
		console.log(`Opening Link ${links[i]}`);
		(async () => {
			const browser = await playwright.chromium.launch();
			const page = await browser.newPage();
			await page.goto(links[i]);
			//This is strictly for wohnungshelden and breaks the second they change the site
			const cookieButton = ".cn-buttons > button";
			const cookieModal = await page.$(".cookie-modal");
			if(cookieModal) {
				await page.waitForTimeout(200);
				await page.click(cookieButton);
			}
			//Erwachsene
			await page.type('#formly_2_input_grownUps_0', formInfo.grownups);
			//Kinder
			await page.type('#formly_2_input_kids_1', formInfo.children);
			//Personengruppe
			await page.click("#formly_3_select_employmentTypes_0");
			for(let i = 0; i < formInfo.employment.length; i++) {
				await page.click(`text=${formInfo.employment[i]}`);
			}
			//Closes weird overlay
			await page.click('.cdk-overlay-container');
			//Einkommen
			await page.click('#formly_3_select_income_1');
			await page.click(`text=${formInfo.income}`);
			//Einzugstermin
			let date = formInfo.move_in;
			if(formInfo.move_in == '0') {
				let today = new Date();
				let day = today.getDate() > 9 ? today.getDate() : "0" + today.getDate();
				let month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1);
				let year = today.getFullYear();
				date = `${day}.${month}.${year}`;
			} 
			await page.type('#formly_3_input_earliestMoveInDate_2', date);
			//WBS
			await page.click(`#formly_3_radio_wbs_special_housing_need_2 >> text=${formInfo.wbs ? 'Ja' : 'Nein'}`);
			if(formInfo.wbs) {
				await page.type('[id="formly_4_input_$$_wbs_valid_until_$$_0"]', `${formInfo.wbs_date}`);
				await page.click('#formly_4_select_eligibleNumberOfRooms_1');
				//16th Child is 1 room
				await page.click(`.ant-select-dropdown-menu-item >> nth=${15 + parseInt(formInfo.wbs_rooms)}`);
			}
			//Haustiere
			await page.click(`#formly_5_radio_pets_0 >> text=${formInfo.pets ? 'Ja' : 'Nein'}`);
			if(formInfo.pets) {
				await page.click(`#formly_5_radio_combatDog_1 >> text=${formInfo.combat_dog ? 'Ja' : 'Nein'}`);
			}
			//Wohnungsverlust
			await page.click(`#formly_5_radio_flatLoss_5 >> text=${formInfo.pending_flat_loss ? 'Ja' : 'Nein'}`);
			//Erste Haushaltsgründung
			await page.click(`#formly_5_radio_firstFlat_6 >> text=${formInfo.first_flat ? 'Ja' : 'Nein'}`);
			//M Schein
			await page.click(`#formly_5_radio_m-schein-available_7 >> text=${formInfo.m_slip ? 'Ja' : 'Nein'}`);
			//Datenschutz
			await page.click('#formly_5_checkbox_dataPrivacy_9');
			//For debug, shows you result page
			//await page.screenshot({path: `${i}.png`, fullPage: true});
			//Accept
			//await page.click('#send-applicant-form-button');
			await page.waitForTimeout(200);
			await browser.close();
			console.log("Sent form");
		})();
	}
});