// src/middleware/apiKey.js
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey && apiKey === 'ecotrack2026uas') {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized: API Key tidak valid pada header 'x-api-key'!"
    });
  }
};

module.exports = apiKeyMiddleware;