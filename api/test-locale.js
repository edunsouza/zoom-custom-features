const moment = require('moment');

module.exports = (req, res) => {
    try {
        const { tipo } = req.query;
        let data = '';

        if (tipo == 'locale') {
            require('moment/locale/pt-br');
            moment.locale('pt-br');
            data = moment().format('DD/MM/YYYY - dddd');
        } else {
            moment.updateLocale('pt-br');
            data = moment().format('DD/MM/YYYY - dddd');
        }

        res.status(200).json({ success: true, message: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Dados incorretos!' });
    }
}