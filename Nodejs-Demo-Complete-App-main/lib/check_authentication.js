module.exports = {
    isLoggedin(req, res, next) {
        if (req.session.user) {
            return next();
        }
        return res.redirect('/auth/login');
    },

    isNotLoggedin(req, res, next) {
        if (!req.session.user) {
            return next();
        }
        return res.redirect('/');
    }

}
