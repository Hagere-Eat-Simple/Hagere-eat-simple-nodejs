module.exports = {
    isLoggedin(req, res, next) {
        // if (req.session.userID) {
        //     return next();
        // }
        // return res.redirect('/auth/login');
        return next();
    },

    isNotLoggedin(req, res, next) {
        if (!req.session.userID) {
            return next();
        }
        return res.redirect('/');
    }

}
