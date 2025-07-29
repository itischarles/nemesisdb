
exports.userDashboard = (req, res) => {
    res.render('post-auth-layout', { user: req.user });
};

exports.userProfileContent = async (req, res) => {
    res.render('user/userProfileContent', { user: req.user });
};

exports.userInfoContent = async (req, res) => {
    res.render('user/userInfoContent', { user: req.user });
};


