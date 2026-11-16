import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { wrap, fail } from '../middleware/async.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export const create = wrap(async (req, res) => {
  const { doctor, appointmentDate, appointmentTime, reason } = req.body;
  if (!doctor || !appointmentDate || !appointmentTime || !reason?.trim())
    return fail(res, 400, 'Doctor, date, time and reason are required');
  if (!DATE.test(appointmentDate) || !TIME.test(appointmentTime)) return fail(res, 400, 'Invalid date or time format');

  const doc = await User.findOne({ _id: doctor, role: 'doctor', isActive: true });
  if (!doc) return fail(res, 404, 'Doctor not found');

  const when = new Date(`${appointmentDate}T${appointmentTime}:00`);
  if (isNaN(when) || when <= new Date()) return fail(res, 400, 'Please choose a date and time in the future');

  const date = new Date(`${appointmentDate}T00:00:00.000Z`);
  const clash = await Appointment.findOne({
    doctor, appointmentDate: date, appointmentTime, status: { $in: ['pending', 'approved'] },
  });
  if (clash) return fail(res, 409, 'That time is already taken. Please pick another slot');

  const appt = await Appointment.create({ patient: req.user._id, doctor, appointmentDate: date, appointmentTime, reason });
  res.status(201).json(appt);
});

export const my = wrap(async (req, res) => {
  res.json(await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialization experience').sort('-appointmentDate appointmentTime'));
});

export const forDoctor = wrap(async (req, res) => {
  res.json(await Appointment.find({ doctor: req.user._id }).populate('patient', 'name email').sort('-appointmentDate appointmentTime'));
});

export const setStatus = wrap(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return fail(res, 400, 'Status must be approved or rejected');
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return fail(res, 404, 'Appointment not found');
  if (String(appt.doctor) !== String(req.user._id)) return fail(res, 403, 'This appointment is assigned to another doctor');
  if (appt.status !== 'pending') return fail(res, 400, 'Only pending requests can be updated');
  appt.status = status;
  await appt.save();
  res.json(appt);
});

export const cancel = wrap(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return fail(res, 404, 'Appointment not found');
  if (String(appt.patient) !== String(req.user._id)) return fail(res, 403, 'You can only cancel your own appointments');
  if (appt.status !== 'pending') return fail(res, 400, 'Only pending appointments can be cancelled');
  appt.status = 'cancelled';
  await appt.save();
  res.json(appt);
});
