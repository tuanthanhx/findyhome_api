import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import config from '../config/config';
import User from '../modules/user/user.model';
import { getNextReferralId } from '../modules/counter/counter.service';

const seedDatabase = async () => {
  try {
    await mongoose
      .connect(config.mongoUri)
      .then(() => console.log('✅ MongoDB Connected'))
      .catch((err) => console.error('❌ MongoDB connection Failed:', err));

    // await User.deleteMany();
    // console.log('✅ Existing Data Deleted!');
    // console.log('🔄 Seeding Data...');
    // const users = generateUsers(3);
    // await User.insertMany(users);
    // console.log('✅ Seed data inserted successfully!');

    const aaa = await getNextReferralId();
    console.log('xxxxxxxx1');
    console.log(aaa);
    console.log('xxxxxxxx2');

  } catch (error) {
    console.error('❌ Error inserting seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
