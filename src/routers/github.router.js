const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/github', passport.authenticate('auth-github', { scope: ['user:username'] }));

router.get('/github/callback',
    (req, res, next) => {
        passport.authenticate('auth-github', { scope: ['user:username'] }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/view/login');
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/view/profileGit');
            });
        })(req, res, next);
    }
);

module.exports = router;

