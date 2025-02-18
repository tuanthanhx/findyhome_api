import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import config from '../config/config';
import User from '../modules/user/user.model';

const generateUsers = (count: number) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    users.push({
      email: faker.internet.email({ firstName: name }),
      username: faker.internet.username({ firstName: name }),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement([2, 6, 3]),
      status: faker.helpers.arrayElement([0, 1]),
      avatar: faker.image.avatar(),
      name,
      dob: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
      nationalId: faker.string.numeric(12),
      phone: `+84${i}${faker.string.numeric(8)}`,
      address: faker.location.streetAddress(),
      socialProfile: {
        facebook: faker.internet.url(),
        tiktok: faker.internet.url(),
      },
      baseSalary: faker.number.int({ min: 500, max: 5000 }),
      bankAccount: {
        bankName: faker.company.name(),
        branch: faker.location.city(),
        accountNumber: faker.string.numeric(10), // Random 10-digit account number
      },
      bio: faker.person.bio(),
    });
  }

  return users;
};

const seedDatabase = async () => {
  try {
    await mongoose
      .connect(config.mongoUri)
      .then(() => console.log('✅ MongoDB Connected'))
      .catch((err) => console.error('❌ MongoDB connection Failed:', err));

    // await User.deleteMany();
    console.log('✅ Existing Data Deleted!');
    console.log('🔄 Seeding Data...');
    const users = await generateUsers(10);
    for (const userData of users) {
      await User.create(userData);
    }
    console.log('✅ Seed data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
