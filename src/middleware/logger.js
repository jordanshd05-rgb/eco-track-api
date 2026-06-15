// src/middleware/logger.js
const loggerMiddleware = (req, res, next) => {
  console.log(`[EcoTrack-Log] ${new Date().toISOString()} | ${req.method} -> ${req.url}`);
  next();
};

module.exports = loggerMiddleware;