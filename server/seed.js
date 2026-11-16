import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const people = [
  { name: 'Clinic Admin', email: 'admin@medix.com', password: 'Admin@123', role: 'admin' },
  { name: 'Dr. Ahmed', email: 'ahmed@medix.com', password: 'Doctor@123', role: 'doctor', specialization: 'Cardiologist', experience: 5 },
  { name: 'Dr. Sara Khan', email: 'sara@medix.com', password: 'Doctor@123', role: 'doctor', specialization: 'Dermatologist', experience: 8 },
  { name: 'Dr. Ali Raza', email: 'ali@medix.com', password: 'Doctor@123', role: 'doctor', specialization: 'Pediatrician', experience: 3 },
  { name: 'Hira Patient', email: 'patient@medix.com', password: 'Patient@123', role: 'patient' },
];

await mongoose.connect(process.env.MONGO_URI);
for (const p of people) {
  if (await User.findOne({ email: p.email })) { console.log('exists  ', p.email); continue; }
  await User.create(p);
  console.log('created ', p.email, '/', p.password);
}
await mongoose.disconnect();
