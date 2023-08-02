const passport = require("passport");
const GitUser = require('../../dao/mongo/models/modelGitUser')

passport.serializeUser((gitUser, done) => {
    // Serialize the gitUser's ID
    done(null, gitUser._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Deserialize the gitUser by fetching from the database using the ID
        const gitUser = await GitUser.findById(id);
        done(null, gitUser); 
    } catch (error) {
        done(error);
    }
});

module.exports = passport