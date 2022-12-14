
exports.invalidPathHandler = (req, res) => {
    res.status(404).send({ msg: 'No Such Path' });
};

exports.badRequestHandler = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    } else {
        next(err);
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'Sorry, I wrote some bad code...' });
};