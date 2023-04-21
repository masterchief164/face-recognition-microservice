const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(req.cookies);
    if (token == null) {
        return res.status(401)
            .send('Unauthorized');
    }
    jwt.verify(token, process.env.CLIENT_SECRET, {}, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return res.status(403).json('You do not have permission ot perform this action');
        }
        next();
    }
};

module.exports = {verify, restrictTo};
