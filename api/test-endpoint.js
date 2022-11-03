const { allowCors } = require('../helpers');

const test = async (req, res) => {
  console.log(':EMAIL_TO:', process.env.EMAIL_TO);
  res.status(200).json(process.env.EMAIL_TO);
};

module.exports = allowCors(test);
