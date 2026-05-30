# INSPIRE Attendance System

## الوصف
مشروع بسيط لتسجيل حضور الطلاب باستخدام صفحة واجهة أمامية و backend Node.js مع MongoDB.

## الهيكل
- `attendance.html` — صفحة تسجيل الحضور.
- `dashboard.html` — صفحة لوحة القيادة.
- `server/` — backend Express + MongoDB.

## تجهيز النشر
1. انسخ `server/.env.example` إلى `server/.env`.
2. عدّل `MONGODB_URI` إلى رابط قاعدة بيانات MongoDB الخاص بك.
3. اضبط `PORT` إذا كنت تحتاج إلى رقم منفذ مختلف.

## التشغيل محلياً
```bash
cd server
npm install
npm start
```

## ملء بيانات تجريبية
```bash
cd server
npm run seed
```

ثم افتح المتصفح على:
- `http://localhost:5000/` لصفحة الحضور
- `http://localhost:5000/dashboard` للوحة القيادة

## نشر على استضافة Node.js
- تأكد من أن الاستضافة تدعم Node.js ووجود `PORT` و `MONGODB_URI` في متغيرات البيئة.
- ارفع المشروع كاملاً.
- إذا كان السيرفر قادرًا على تشغيل `server/server.js`، فسيعمل التطبيق مباشرة.

## ملاحظات
- `attendance.html` الآن يستخدم `GET /api/register` عبر `fetch` على نفس النطاق.
- `dashboard.html` الآن يستخدم `GET`, `POST`, `PUT`, و `DELETE` إلى `/api/students` عبر نفس backend المحلي.
- إذا كنت تستخدم استضافة ثابتة فقط (مثل GitHub Pages)، فستحتاج إلى استضافة الـ backend أيضاً لأن المشروع يعتمد على API.
