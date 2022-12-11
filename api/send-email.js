const sendgrid = require('@sendgrid/mail');
const moment = require('moment');
require('moment/locale/pt-br');

const { allowCors } = require('../helpers');

const getHtmlBody = (attendance = 'Não informado', congregation = 'Nordeste', meeting) => {
	return `
        <div style="display: grid">
            <h1 style="text-align: center; background-color: #4a6ca7; color: white; text-transform: uppercase;">
                ${congregation} - ${meeting}
            </h1>
            <h1 style="text-align: center; color: #4a6ca7">Assistência: ${attendance}</h1>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/JW_Logo.svg/240px-JW_Logo.svg.png"
                style="display: block; margin-left: auto; margin-right: auto;"
                width="100"
                height="100"
                alt="jw"
                title="jw"
            />
        </div>
    `;
};

const sendEmail = async (req, res) => {
	try {
		const { attendance, id } = req.body;
		const meeting = moment.locale('pt-br') && moment().format('DD/MM/YYYY - dddd');

		if (process.env.ATTENDANCE_ID.toLowerCase() !== id.toLowerCase()) {
			return res.status(401).json({ success: false, message: 'Identificação inválida!' });
		}

		if (!attendance || attendance < 1) {
			return res.status(400).json({ success: false, message: 'Assistência não informada!' });
		}

		sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

		await sendgrid.send({
			from: `Automação - Nordeste <${process.env.EMAIL_SENDER}>`,
			to: (process.env.EMAIL_TO || '').split(','),
			subject: `Assistência Nordeste - ${meeting}`,
			html: getHtmlBody(attendance, id, meeting)
		});

		res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
	} catch (error) {
		console.log(JSON.stringify(error, null, 4));
		res.status(500).json({ success: false, message: 'Dados incorretos!' });
	}
};

module.exports = allowCors(sendEmail);