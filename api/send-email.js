const sgMail = require('@sendgrid/mail');
const moment = require('moment');
require('moment/locale/pt-br');

const getHtmlBody = (assistencia = 'Não informado', congregacao = 'Nordeste', reuniao) => {
    return `
        <div style="display: grid">
            <h1 style="text-align: center; background-color: #4a6ca7; color: white; text-transform: uppercase;">
                ${congregacao} - ${reuniao}
            </h1>
            <h1 style="text-align: center; color: #4a6ca7">Assistência: ${assistencia}</h1>
            <img
                src="https://assetsnffrgf-a.akamaihd.net/assets/m/802013048/univ/art/802013048_univ_sqr_md.jpg"
                style="display: block; margin-left: auto; margin-right: auto;"
                width="100"
                height="100"
                alt="jw"
                title="jw"
            />
        </div>
    `;
};

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    return await fn(req, res);
}

const sendEmail = async (req, res) => {
    try {
        const { assistencia, congregacao } = req.body;
        const reuniao = moment.locale('pt-br') && moment().format('DD/MM/YYYY - dddd');

        if (!assistencia || assistencia < 1) {
            return res.status(500).json({ success: false, message: 'Assistência não informada!' });
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.send({
            from: `Automação - Nordeste <${process.env.EMAIL_SENDER}>`,
            to: (process.env.EMAIL_TO || '').split(','),
            subject: `Assistência Nordeste - ${reuniao}`,
            html: getHtmlBody(assistencia, congregacao, reuniao)
        });

        res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.log(JSON.stringify(error, null, 4));
        res.status(500).json({ success: false, message: 'Dados incorretos!' });
    }
}

module.exports = allowCors(sendEmail);