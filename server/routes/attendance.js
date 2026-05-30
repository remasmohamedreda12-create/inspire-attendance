import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const isValidSession = (session) => /^[1-8]$/.test(String(session));

router.get('/register', async (req, res) => {
  const id = (req.query.id || '').trim().toUpperCase();
  const session = req.query.session || '1';

  if (!id) {
    return res.json({ success: false, message: 'يرجى إدخال المعرف الشخصي.' });
  }

  if (!isValidSession(session)) {
    return res.json({ success: false, message: 'رقم السيشن غير صالح.' });
  }

  try {
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !student) {
      return res.json({ success: false, message: 'المعرف غير موجود.' });
    }

    const sessionKey = `s${session}`;
    const timeKey = `t${session}`;

    if (student[sessionKey]) {
      return res.json({
        success: false,
        already: true,
        name: student.name,
        message: 'تم تسجيل حضورك من قبل في هذه الجلسة'
      });
    }

    const { error: updateError } = await supabase
      .from('students')
      .update({
        [sessionKey]: true,
        [timeKey]: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) throw updateError;

    return res.json({
      success: true,
      already: false,
      name: student.name,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('Attendance register error:', error);
    return res.json({ success: false, message: 'حدث خطأ في السيرفر، حاول لاحقاً.' });
  }
});

router.get('/students', async (req, res) => {
  const query = (req.query.search || '').trim();

  try {
    let request = supabase.from('students').select('*');

    if (query) {
      request = request.or(`id.ilike.%${query}%,name.ilike.%${query}%`);
    }

    const { data: students, error } = await request.order('name');

    if (error) throw error;

    const normalized = students.map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone || '',
      sessions: [s.s1, s.s2, s.s3, s.s4, s.s5, s.s6, s.s7, s.s8],
      times: [s.t1, s.t2, s.t3, s.t4, s.t5, s.t6, s.t7, s.t8]
    }));

    return res.json({ success: true, data: normalized });
  } catch (error) {
    console.error('Fetch students error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في جلب البيانات.' });
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
    const { error } = await supabase.from('students').insert([
      {
        id,
        name,
        phone,
        s1: false, s2: false, s3: false, s4: false,
        s5: false, s6: false, s7: false, s8: false,
        t1: null, t2: null, t3: null, t4: null,
        t5: null, t6: null, t7: null, t8: null
      }
    ]);

    if (error) throw error;

    return res.json({ success: true, data: { id, name, phone, sessions: [false, false, false, false, false, false, false, false], times: [null, null, null, null, null, null, null, null] } });
  } catch (error) {
    console.error('Create student error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في إضافة الطالب.' });
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
    const updateData = { name, phone };
    for (let i = 0; i < 8; i++) {
      updateData[`s${i + 1}`] = Boolean(sessions[i]);
      if (sessions[i]) {
        updateData[`t${i + 1}`] = new Date().toISOString();
      } else {
        updateData[`t${i + 1}`] = null;
      }
    }

    const { error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    return res.json({ success: true, data: { id, name, phone, sessions, times: [] } });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في تحديث الطالب.' });
  }
});

router.delete('/students/:id', async (req, res) => {
  const id = (req.params.id || '').trim().toUpperCase();

  try {
    const { error } = await supabase.from('students').delete().eq('id', id);

    if (error) throw error;

    return res.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في حذف الطالب.' });
  }
});

export default router;
