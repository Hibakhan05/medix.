export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const fail = (res, code, message) => res.status(code).json({ message });
