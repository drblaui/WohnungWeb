require('dotenv').config();

export const formInfo = {
	grownups: process.env.NUM_GROWN_UPS || '1',
	children: process.env.NUM_KIDS || '0',
	employment: process.env.TYPE_EMPLOYMENT ? process.env.TYPE_EMPLOYMENT.split(',') : ["Angestellte(r)"],
	income: process.env.INCOME || "500€ - 1.000€",
	move_in: process.env.MOVE_IN_DATE || '0',
	wbs: process.env.HAS_WBS === 'true',
	wbs_date: process.env.WBS_VALID_DATE || '01.01.1970',
	wbs_rooms: process.env.WBS_NUM_ROOMS || '1',
	could_get_wbs: process.env.COULD_GET_WBS === 'true',
	pets: process.env.HAS_PETS === 'true',
	combat_dog: process.env.IS_COMBAT_DOG === 'true',
	pending_flat_loss: process.env.PENDING_FLAT_LOSS === 'true',
	first_flat: process.env.FIRST_FLAT === 'true',
	m_slip: process.env.M_SLIP === 'true',
}

export default formInfo;
