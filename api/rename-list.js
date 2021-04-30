const { google } = require('googleapis');
const { allowCors } = require('../helpers');

let sheetsAPI = null;
const private_key = process.env.GOOGLE_API_KEY;
const client_email = process.env.GOOGLE_API_EMAIL;

async function getSheet(spreadsheetId, range) {
	if (sheetsAPI === null) {
		sheetsAPI = google.sheets({
			version: 'v4',
			auth: new google.auth.GoogleAuth({
				credentials: { private_key, client_email },
				scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
			})
		});
	}

	return await sheetsAPI.spreadsheets.values.get({ spreadsheetId, range });
}

async function getRenameList(req, res) {
	try {
		const { id } = req.query || {};

		if (!id) {
			return res.status(400).json({ success: false, message: 'Não encontrado!' });
		}

		const sheet = await getSheet('1z8whRV9lIIPutRN8zxNrGo5rG6uLEulM96H6VCyvAJM', 'key-value!A2:B');
		const row = sheet.data.values.find(r => r.includes(id));
		const renameListId = row.pop();

		const renameList = await getSheet(renameListId, 'zoom!A2:B');

		res.status(200).json({ success: true, list: renameList.data.values });
	} catch (error) {
		console.log(JSON.stringify(error, null, 4));
		res.status(500).json({ success: false, message: 'Dados incorretos!' });
	}
}

module.exports = allowCors(getRenameList);