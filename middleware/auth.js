const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function requireLogin(req, res, next) {
    const authHeader = req.headers['authorization'];
  //  const token = authHeader?.split(' ')[1];
    const token = req.cookies.token || authHeader?.split(' ')[1];

    if (!token) return unauth(res, req);

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // attach decoded info to request
        next();
    } catch (err) {
        return unauth(res, req);
    }
}

function unauth(res, req) {
    if (req.headers['hx-request']) {
        return res.status(401).send('<div class="error">Please log in</div>');
    } else {
        return res.status(401).send('Unauthorized');
    }
}

module.exports = requireLogin;
