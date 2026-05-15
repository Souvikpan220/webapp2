export function getIp(req) {
  return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString().split(",")[0].trim();
}

export function requester(req, deviceId) {
  return {
    ip: getIp(req),
    deviceId
  };
}
