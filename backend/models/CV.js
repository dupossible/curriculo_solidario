import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  from: String,
  to: String,
  description: String
}, {_id:false});

const EducationSchema = new mongoose.Schema({
  course: String,
  institution: String,
  conclusion: String
}, {_id:false});

const SkillSchema = new mongoose.Schema({
  name: String,
  conclusion: String
}, {_id:false});

const CVSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  summary: String,
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  skillCourses: [SkillSchema],
  printCode: { type: String, unique: true }
}, { timestamps: true });

export default mongoose.model('CV', CVSchema);
