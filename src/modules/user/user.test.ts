import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../app';
import {
  connectTestDB,
  disconnectTestDB,
} from '../../utils/jest/setup_test_db';
import User from './user.model';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await User.deleteMany();
});

const userName01 = faker.person.fullName();
const user01 = {
  email: faker.internet.email({ firstName: userName01 }),
  username: faker.internet.username({ firstName: userName01 }),
  password: faker.internet.password(),
  roles: [2],
  status: faker.helpers.arrayElement([0, 1]),
  avatar: faker.image.avatar(),
  name: userName01,
  dob: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
  nationalId: faker.string.numeric(12),
  phone: `+84${faker.string.numeric(8)}`,
  address: faker.location.streetAddress(),
  socialProfile: {
    facebook: faker.internet.url(),
    tiktok: faker.internet.url(),
  },
  baseSalary: faker.number.int({ min: 500, max: 5000 }),
  bankAccount: {
    bankName: faker.company.name(),
    branch: faker.location.city(),
    accountNumber: faker.string.numeric(10),
  },
  bio: faker.person.bio(),
};

const userName02 = faker.person.fullName();
const user02 = {
  email: faker.internet.email({ firstName: userName02 }),
  username: faker.internet.username({ firstName: userName02 }),
  password: faker.internet.password(),
  roles: [6],
  status: faker.helpers.arrayElement([0, 1]),
  avatar: faker.image.avatar(),
  name: userName02,
  dob: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
  nationalId: faker.string.numeric(12),
  phone: `+84${faker.string.numeric(8)}`,
  address: faker.location.streetAddress(),
  socialProfile: {
    facebook: faker.internet.url(),
    tiktok: faker.internet.url(),
  },
  baseSalary: faker.number.int({ min: 500, max: 5000 }),
  bankAccount: {
    bankName: faker.company.name(),
    branch: faker.location.city(),
    accountNumber: faker.string.numeric(10),
  },
  bio: faker.person.bio(),
};

const insertUser = async (user: Record<string, any>) => {
  await User.create(user);
};

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        // referrerId: 1000034,
        email: 'MiriamJacobson_Daniel51_x889@hotmail.com',
        username: '',
        password: '123456',
        roles: [2],
        status: 1,
        avatar:
          'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/39.jpg',
        name: 'Miriam Jacobson',
        dob: '2001-02-26T08:07:50.174Z',
        nationalId: '',
        phone: '',
        address: '700 Maple Drive',
        socialProfile: {
          facebook: 'https://utter-surface.name/asdfasfx7',
          tiktok: 'https://educated-phrase.biz/asdfasfx7',
        },
        baseSalary: 1057,
        bankAccount: {
          bankName: "O'Conner, Funk and Reynolds",
          branch: 'North Valentinburgh',
          accountNumber: '1450139759x889',
        },
        bio: 'lotion lover, scientist ☝🏽',
      };

      const response = await request(app).post('/api/v1/users').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.address).toBe(userData.address);
    });

    it('should not create a user with invalid data', async () => {
      const response = await request(app).post('/api/v1/users').send({
        foo: 'bar',
      });

      expect(response.status).toBe(400);
    });
  });
  describe('GET /users', () => {
    it('should get a list of users', async () => {
      await insertUser(user01);
      await insertUser(user02);

      const response = await request(app).get('/api/v1/users');

      expect(response.status).toBe(200);
      // console.log(JSON.stringify(response.body, null, 2));
    });
  });
});
