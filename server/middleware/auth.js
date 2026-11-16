import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fail } from './async.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return fail(res, 401, 'Please log in to continue');
  try {
    const { id } = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return fail(res, 401, 'This account no longer exists');
    if (!user.isActive) return fail(res, 403, 'This account has been deactivated');
    req.user = user;
    next();
  } catch {
    fail(res, 401, 'Your session has expired. Please log in again');
  }
};

export const authorizeRoles = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : fail(res, 403, 'You do not have access to this resource');
