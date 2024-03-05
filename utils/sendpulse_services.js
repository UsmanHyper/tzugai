
/**
 *  @author  DANISH HUSSAIN <danishhussain9525@hotmail.com>
 *  @link    Author Website: https://danishhussain.w3spaces.com/
 *  @link    Author LinkedIn: https://pk.linkedin.com/in/danish-hussain-285345123
 *  @since   2020-03-01
**/

var colors = require('colors'),
	axios = require('axios'),
	FormData = require('form-data');
// config = require('../../config/local'),
// Models = require('../database/db_orm/models'),
// ObjectId = require('mongodb').ObjectID,
// stripe = require('stripe')

let BASE_URL = process.env.SENDPULSE_BASE_URL ?? ''
let GRANT_TYPE = process.env.SENDPULSE_GRANT_TYPE ?? ''
let CLIENT_ID = process.env.SENDPULSE_CLIENT_ID ?? ''
let CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET ?? ''
let MAIL_LIST_ID = process.env.SENDPULSE_MAIL_LIST_ID ?? 0

if (!BASE_URL || BASE_URL == '') {
	console.log(colors.red('process.env.SENDPULSE_BASE_URL is null'));
	throw 'Exception: process.env.SENDPULSE_BASE_URL is null'
}
if (!GRANT_TYPE || GRANT_TYPE == '') {
	console.log(colors.red('process.env.SENDPULSE_GRANT_TYPE is null'));
	throw 'Exception: process.env.SENDPULSE_GRANT_TYPE is null'
}
if (!CLIENT_ID || CLIENT_ID == '') {
	console.log(colors.red('process.env.SENDPULSE_CLIENT_ID is null'));
	throw 'Exception: process.env.SENDPULSE_CLIENT_ID is null'
}
if (!CLIENT_SECRET || CLIENT_SECRET == '') {
	console.log(colors.red('process.env.SENDPULSE_CLIENT_SECRET is null'));
	throw 'Exception: process.env.SENDPULSE_CLIENT_SECRET is null'
}
// if(!MAIL_LIST_ID || MAIL_LIST_ID == 0) {
// 	console.log(colors.red('process.env.SENDPULSE_MAIL_LIST_ID is null'));
// 	throw 'Exception: process.env.SENDPULSE_MAIL_LIST_ID is null'
// }

const getAccessToken = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let END_POINT = '/oauth/access_token'
			let form_data = new FormData();

			form_data.append('grant_type', GRANT_TYPE);
			form_data.append('client_id', CLIENT_ID);
			form_data.append('client_secret', CLIENT_SECRET);

			let axios_config = {
				method: 'POST',
				maxBodyLength: Infinity,
				url: BASE_URL + END_POINT,
				data: form_data
			};

			await axios.request(axios_config)
				.then((response) => {
					resolve(response.data)
				})
				.catch((error) => {
					console.log(error);
				});
		}
		catch (err) {
			reject(err)
		}
	})
}

const addNewUserIntoMailingList = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let END_POINT = '/addressbooks/' + MAIL_LIST_ID + '/emails'
			let form_data = await jsonToFormData(data)

			let axios_config = {
				method: 'POST',
				maxBodyLength: Infinity,
				url: BASE_URL + END_POINT,
				headers: {
					'Authorization': `Bearer ${data.access_token}`,
					'Content-Type': 'multipart/form-data',
				},
				data: form_data
			};

			await axios.request(axios_config)
				.then((response) => {
					resolve(response.data)
				})
				.catch((error) => {
					console.log(error);
				});
		}
		catch (err) {
			reject(err)
		}
	})
}

const getAddressBooks = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let END_POINT = '/addressbooks?limit=10&offset=1'
			let form_data = new FormData();

			let axios_config = {
				method: 'GET',
				maxBodyLength: Infinity,
				url: BASE_URL + END_POINT,
				headers: {
					Authorization: `Bearer ${data.access_token}`,
					'Content-Type': 'application/json',
				},
				data: form_data
			};

			await axios.request(axios_config)
				.then((response) => {
					resolve(response.data)
				})
				.catch((error) => {
					console.log(error);
				});
		}
		catch (err) {
			reject(err)
		}
	})
}

const sendEmail = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let END_POINT = '/smtp/emails'
			let form_data = await jsonToFormData(data)

			let axios_config = {
				method: 'POST',
				maxBodyLength: Infinity,
				url: BASE_URL + END_POINT,
				headers: {
					'Authorization': `Bearer ${data.access_token}`,
					'Content-Type': 'multipart/form-data',
				},
				data: form_data
			};

			await axios.request(axios_config)
				.then((response) => {
					resolve(response.data)
				})
				.catch((error) => {
					console.log(error);
				});
		}
		catch (err) {
			reject(err)
		}
	})
}

const buildFormData = async (formData, data, parentKey) => {
	// if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
	if (data && typeof data === 'object' && !(data instanceof Date)) {
		Object.keys(data).forEach(key => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
		});
	} else {
		const value = data == null ? '' : data;
		formData.append(parentKey, value);
	}
}

const jsonToFormData = async (data) => {
	const formData = new FormData();
	await buildFormData(formData, data);

	return formData;
}

module.exports = {
	getAccessToken,
	addNewUserIntoMailingList,
	getAddressBooks,
	sendEmail
}