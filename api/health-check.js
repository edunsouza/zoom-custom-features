module.exports = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is up and running'
    });
}