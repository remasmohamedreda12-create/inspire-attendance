import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

const isValidSession = (session) => /^[1-8]$/.test(String(session));

const normalizeStudent = (student) => {
  const sessions = [];
  const times = [];

  for (let i = 1; i <= 8; i++) {
    sessions.push(Boolean(student.sessions[`S${i}`]));
    const time = student.times[`T${i}`];
    times.push(time ? time.toISOString() : '');
  }

  return {
    id: student.id,
    name: student.name,
    phone: student.phone || '',
    sessions,
    times
  };
};

router.get('/register', async (req, res) => {
  const action = req.query.action;
  if (action && action !== 'register') {
    return res.json({ success: false, message: 'Action غير معتمد' });
  }

  const id = (req.query.id || '').trim().toUpperCase();
  const session = req.query.session || '1';

  if (!id) {
    return res.json({ success: false, message: 'يرجى إدخال المعرف الشخصي.' });
  }

  if (!isValidSession(session)) {
    return res.json({ success: false, message: 'رقم السيشن غير صالح.' });
  }

  try {
    const student = await Student.findOne({ id });
    if (!student) {
      return res.json({ success: false, message: 'المعرف غير موجود.' });
    }

    const sessionKey = `S${session}`;
    const timeKey = `T${session}`;

    if (student.sessions[sessionKey]) {
      return res.json({
        success: false,
        already: true,
        name: student.name,
        message: 'تم تسجيل حضورك من قبل في هذه الجلسة'
      });
    }

    student.sessions[sessionKey] = true;
    student.times[timeKey] = new Date();
    await student.save();

    return res.json({
      success: true,
      already: false,
      name: student.name,
      time: student.times[timeKey]
    });
  } catch (error) {
    console.error('Attendance register error:', error);
    return res.json({ success: false, message: 'حدث خطأ في السيرفر، حاول لاحقاً.' });
  }
});

router.get('/students', async (req, res) => {
  const query = (req.query.search || '').trim();
  const filter = {};

  if (query) {
    const regex = new RegExp(query, 'i');
    filter.$or = [{ id: regex }, { name: regex }];
  }

  try {
    const students = await Student.find(filter).sort({ name: 1 });
    return res.json({ success: true, data: students.map(normalizeStudent) });
  } catch (error) {
    console.error('Fetch students error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب بيانات الطلاب.' });
  }
});

router.post('/students', async (req, res) => {
  const id = (req.body.id || '').trim().toUpperCase();
  const name = (req.body.name || '').trim();
  const phone = (req.body.phone || '').trim();

  if (!id || !name) {
    return res.status(400).json({ success: false, message: 'الـ ID والاسم مطلوبان.' });
  }

  try {
    const existing = await Student.findOne({ id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'هذا الـ ID موجود بالفعل.' });
    }

    const sessions = {};
    const times = {};
    for (let i = 1; i <= 8; i++) {
      sessions[`S${i}`] = false;
      times[`T${i}`] = null;
    }

    const student = await Student.create({ id, name, phone, sessions, times });
    return res.json({ success: true, data: normalizeStudent(student) });
  } catch (error) {
    console.error('Create student error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة الطالب.' });
  }
});

router.put('/students/:id', async (req, res) => {
  const id = (req.params.id || '').trim().toUpperCase();
  const name = (req.body.name || '').trim();
  const phone = (req.body.phone || '').trim();
  const sessions = Array.isArray(req.body.sessions) ? req.body.sessions : [];

  if (!name) {
    return res.status(400).json({ success: false, message: 'الاسم مطلوب.' });
  }

  try {
    const student = await Student.findOne({ id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود.' });
    }

    student.name = name;
    student.phone = phone;

    for (let i = 1; i <= 8; i++) {
      const key = `S${i}`;
      const timeKey = `T${i}`;
      const currentValue = Boolean(student.sessions[key]);
      const nextValue = Boolean(sessions[i - 1]);

      if (nextValue && !currentValue) {
        student.sessions[key] = true;
        student.times[timeKey] = new Date();
      } else if (!nextValue) {
        student.sessions[key] = false;
        student.times[timeKey] = null;
      }
    }

    await student.save();
    return res.json({ success: true, data: normalizeStudent(student) });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حفظ بيانات الطالب.' });
  }
});

router.delete('/students/:id', async (req, res) => {
  const id = (req.params.id || '').trim().toUpperCase();

  try {
    const result = await Student.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود.' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الطالب.' });
  }
});

export default router;
