const mongoose = require('mongoose');

const userGitSchema = new mongoose.Schema({
    githubId: String,
    username: String,
});

const UserGit = mongoose.model('UserGit', userGitSchema);

module.exports = UserGit;
