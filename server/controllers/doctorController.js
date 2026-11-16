import User from '../models/User.js';
import { wrap, fail } from '../middleware/async.js';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const listDoctors = wrap(async (req, res) => {
  const q = (req.query.search || '').trim();
  const filter = { role: 'doctor', isActive: true };
  if (q) {
    const rx = new RegExp(esc(q), 'i');
    filter.$or = [{ name: rx }, { specialization: rx }];
  }
  res.json(await User.find(filter).sort('name'));
});

export const getDoctor = wrap(async (req, res) => {
  const doc = await User.findOne({ _id: req.params.id, role: 'doctor' });
  if (!doc) return fail(res, 404, 'Doctor not found');
  res.json(doc);
});
