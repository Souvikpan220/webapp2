import app from "../app.js";

export function createApiHandler(routePath) {
  return function handler(req, res) {
    const queryIndex = req.url.indexOf("?");
    const query = queryIndex >= 0 ? req.url.slice(queryIndex) : "";
    req.url = `${routePath}${query}`;
    return app(req, res);
  };
}
