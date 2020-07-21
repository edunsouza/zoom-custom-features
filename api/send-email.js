const sgMail = require('@sendgrid/mail');
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

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            from: `Automação - Nordeste <${process.env.EMAIL_SENDER}>`,
            to: (process.env.EMAIL_TO || '').split(','),
            subject: `Assistência Nordeste - ${reuniao}`,
            html: getHtmlBody(assistencia, congregacao, reuniao)
        };
        await sgMail.send(msg);

        res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!', body: req.body });
    } catch (error) {
        console.log(error);
        error.response && console.log(error.response.body);
        res.status(500).json({ success: false, message: 'Dados incorretos!', body: req.body });
    }
}