import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Student from './models/Student.js';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const sampleStudents = [
  { id: 'A1001', name: 'أحمد محمد', phone: '+201001234567' },
  { id: 'B2002', name: 'سارة علي', phone: '+201112345678' },
  { id: 'C3003', name: 'مروان حسين', phone: '+201221234567' },
  { id: 'D4004', name: 'ليلى سعيد', phone: '+201331234567' },
  { id: 'E5005', name: 'نور خالد', phone: '+201441234567' }
];

async function seed() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const operations = sampleStudents.map((student) => {
      const sessions = {};
      const times = {};
      for (let i = 1; i <= 8; i++) {
        sessions[`S${i}`] = false;
        times[`T${i}`] = null;
      }

      return {
        updateOne: {
          filter: { id: student.id },
          update: {
            $setOnInsert: {
              id: student.id,
              name: student.name,
              phone: student.phone,
              sessions,
              times
            }
          },
          upsert: true
        }
      };
    });

    const result = await Student.bulkWrite(operations);
    console.log('Seed completed:', result.upsertedCount, 'students added or kept existing.');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
