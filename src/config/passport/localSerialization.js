const passport = require("passport");
const User = require('../../dao/mongo/models/modelUsers');

passport.serializeUser((user, done) => {
    // Serialize the user's ID
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Deserialize the user by fetching from the database using the ID
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport