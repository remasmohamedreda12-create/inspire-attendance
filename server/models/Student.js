import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  sessions: {
    S1: { type: Boolean, default: false },
    S2: { type: Boolean, default: false },
    S3: { type: Boolean, default: false },
    S4: { type: Boolean, default: false },
    S5: { type: Boolean, default: false },
    S6: { type: Boolean, default: false },
    S7: { type: Boolean, default: false },
    S8: { type: Boolean, default: false }
  },
  times: {
    T1: { type: Date },
    T2: { type: Date },
    T3: { type: Date },
    T4: { type: Date },
    T5: { type: Date },
    T6: { type: Date },
    T7: { type: Date },
    T8: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// تحديث الوقت تلقائياً عند التعديل
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
