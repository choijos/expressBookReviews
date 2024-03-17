const JWT_SECRET = require('crypto').randomBytes(32).toString('hex');

modules.exports = JWT_SECRET;