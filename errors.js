exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Sorry, I wrote some bad code...'});
} 

exports.invalidPathHandler = ('/*',( req, res) => {
    res.status(404).send({ msg: 'No Such Path' })
});