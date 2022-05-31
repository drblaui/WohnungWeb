import playwright from "playwright";
import formInfo from "../env_handler";

export async function degewoAutoFill(browser: playwright.Browser, link: string) {
	const playwrightPage = await browser.newPage();
	await playwrightPage.goto(link);
	const cookieButton = ".cn-buttons > button";
	const cookieModal = await playwrightPage.$(".cookie-modal");
	if(cookieModal) {
		await playwrightPage.waitForTimeout(200);
		await playwrightPage.click(cookieButton);
	}
	//Personen
	await playwrightPage.type('#formly_2_input_numberPersonsTotal_0', `${parseInt(formInfo.grownups) + parseInt(formInfo.children)}`);
	const wbsField = await playwrightPage.$('[id="formly_3_radio_$$_wbs_available_$$_0"]');
	if(wbsField) {
		//WBS
		await playwrightPage.click(`[id="formly_3_radio_$$_wbs_available_$$_0"] >> text=${formInfo.wbs ? 'Ja' : 'Nein'}`);
		if(formInfo.wbs) {
			await playwrightPage.type('[id="formly_4_input_$$_wbs_valid_until_$$_0"]', formInfo.wbs_date);
			await playwrightPage.click('[id="formly_4_select_$$_wbs_max_number_rooms_$$_1"]');
			await playwrightPage.click(`.ant-select-dropdown-menu-item >> nth=${parseInt(formInfo.wbs_rooms) - 1}`);
		}
		else {
			await playwrightPage.click(`#formly_4_radio_wbsCalculation_4 >> text=${formInfo.could_get_wbs ? 'Ja' : 'Nein'}`);
		}
	}
	
	//await playwrightPage.screenshot({path: `${link.split("/")[3]}.png`, fullPage: true});
	//Accept
	await playwrightPage.click('#send-applicant-form-button');
	//Let the magic work a bit
	await playwrightPage.waitForTimeout(200);
}