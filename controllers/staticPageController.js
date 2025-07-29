

exports.indexPage = (req, res) => {
    res.render('pre-auth-layout' );
};

exports.homePageContent = (req, res) => {
    res.render('static/homePageContent' );
};



exports.aboutPageContent = (req, res) => {
    res.render('static/aboutPageContent');
};

exports.contactPageContent = (req, res) => {
    res.render('static/contactPageContent');
};