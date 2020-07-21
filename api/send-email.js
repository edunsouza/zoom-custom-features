const nodemailer = require('nodemailer');
const moment = require('moment');

const getHtmlBody = (assistencia = 'Não informado', congregacao = 'Nordeste', reuniao) => {
    return `
        <div style="display: grid">
            <h1 style="text-align: center; background-color: #4a6ca7; color: white; text-transform: uppercase;">
                ${congregacao} - ${reuniao}
            </h1>
            <h1 style="text-align: center; color: #4a6ca7">Assitência: ${assistencia}</h1>
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

module.exports = async (req, res) => {
    try {
        const { assistencia, congregacao } = req.body;
        const reuniao = moment.locale('pt-br') && moment().format('DD/MM/YYYY - dddd');
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PWD,
            }
        });
        await transporter.sendMail({
            from: `"Automação da Congregação Nordeste" <${process.env.EMAIL_SENDER}>`,
            to: process.env.EMAIL_TO,
            subject: `Assistência Nordeste - ${reuniao}`,
            html: getHtmlBody(assistencia, congregacao, reuniao)
        });

        res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        // console.log(error);
        // res.status(500).json({ success: false, message: 'Dados incorretos!' });
        res.status(500).json({ success: false, error: error, jsonError: JSON.stringify(error, null, 4) });
    }
}