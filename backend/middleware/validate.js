export function validate(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.method === "GET" ? req.query : req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      console.warn("[validation] failed", req.method, req.originalUrl, issue?.path?.join("."), issue?.message);
      const error = new Error(issue?.message || "Invalid request data.");
      error.status = 400;
      return next(error);
    }
    req.validated = parsed.data;
    next();
  };
}
