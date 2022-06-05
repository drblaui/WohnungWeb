import playwright from "playwright";
import formInfo from "../env_handler";

export async function gewobagAutoFill(browser: playwright.Browser, link: string) {
	const playwrightPage = await browser.newPage();
	await playwrightPage.goto(link);
	//This is strictly for wohnungshelden and breaks the second they change the site
	const cookieButton = ".cn-buttons > button";
	const cookieModal = await playwrightPage.$(".cookie-modal");
	if(cookieModal) {
		await playwrightPage.waitForTimeout(200);
		await playwrightPage.click(cookieButton);
	}
	//Erwachsene
	await playwrightPage.type('#formly_2_input_grownUps_0', formInfo.grownups);
	//Kinder
	await playwrightPage.type('#formly_2_input_kids_1', formInfo.children);
	//Personengruppe
	await playwrightPage.click("#formly_3_select_employmentTypes_0");
	for(let i = 0; i < formInfo.employment.length; i++) {
		await playwrightPage.click(`text=${formInfo.employment[i]}`);
	}
	//Closes weird overlay
	await playwrightPage.click('.cdk-overlay-container');
	//Einkommen
	await playwrightPage.click('#formly_3_select_income_1');
	await playwrightPage.click(`text=${formInfo.income}`);
	//Einzugstermin
	let date = formInfo.move_in;
	if(formInfo.move_in == '0') {
		let today = new Date();
		let day = today.getDate() > 9 ? today.getDate() : "0" + today.getDate();
		let month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1);
		let year = today.getFullYear();
		date = `${day}.${month}.${year}`;
	} 
	await playwrightPage.type('#formly_3_input_earliestMoveInDate_2', date);
	//WBS
	let specialHousing = await playwrightPage.$('#formly_3_radio_wbs_2');
	if(specialHousing) {
		await playwrightPage.click(`#formly_3_radio_wbs_2 >> text=${formInfo.wbs ? 'Ja' : 'Nein'}`);
	}
	else {
		await playwrightPage.click(`#formly_3_radio_wbs_special_housing_need_2 >> text=${formInfo.wbs ? 'Ja' : 'Nein'}`);
	}
	if(formInfo.wbs) {
		await playwrightPage.type('[id="formly_4_input_$$_wbs_valid_until_$$_0"]', `${formInfo.wbs_date}`);
		await playwrightPage.click('#formly_4_select_eligibleNumberOfRooms_1');
		//16th Child is 1 room
		await playwrightPage.click(`.ant-select-dropdown-menu-item >> nth=${15 + parseInt(formInfo.wbs_rooms)}`);
	}
	//Haustiere
	await playwrightPage.click(`#formly_5_radio_pets_0 >> text=${formInfo.pets ? 'Ja' : 'Nein'}`);
	if(formInfo.pets) {
		await playwrightPage.click(`#formly_5_radio_combatDog_1 >> text=${formInfo.combat_dog ? 'Ja' : 'Nein'}`);
	}
	//Wohnungsverlust
	await playwrightPage.click(`#formly_5_radio_flatLoss_5 >> text=${formInfo.pending_flat_loss ? 'Ja' : 'Nein'}`);
	//Erste Haushaltsgründung
	await playwrightPage.click(`#formly_5_radio_firstFlat_6 >> text=${formInfo.first_flat ? 'Ja' : 'Nein'}`);
	//M Schein
	await playwrightPage.click(`#formly_5_radio_m-schein-available_7 >> text=${formInfo.m_slip ? 'Ja' : 'Nein'}`);
	//Datenschutz
	await playwrightPage.click('#formly_5_checkbox_dataPrivacy_9');
	//For debug, shows you result page
	//await playwrightPage.screenshot({path: `${link.split("/")[3]}.png`, fullPage: true});
	//Accept
	await playwrightPage.click('#send-applicant-form-button');
}