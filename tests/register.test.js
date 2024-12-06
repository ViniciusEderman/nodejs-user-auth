const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/index');
const { User, sequelize } = require('../src/models/user');
const userService = require('../src/services/userService');

beforeAll(async () => {
  await sequelize.authenticate();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

jest.mock('../src/services/userService', () => ({
  createUser: jest.fn(),
}));

describe('POST /api/register', () => {
  it('deve registrar um novo usuário', async () => {
    const newUser = {
      name: 'Teste',
      email: 'teste@example.com',
      password: 'senha123',
    };

    userService.createUser.mockImplementation(async (userData) => {
      const hashedPassword = await bcrypt.hash(userData.password, 10); 
      return await User.create({ ...userData, password: hashedPassword });
    });

    const response = await request(app)
    .post('/api/register')
    .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User registered');

    const userInDb = await User.findOne({ where: { email: newUser.email } });
    expect(userInDb).not.toBeNull();
    expect(await bcrypt.compare(newUser.password, userInDb.password)).toBe(true)
  });

  it('deve retornar erro ao tentar registrar com email existente', async () => {
    const existingUser = {
      name: 'Teste',
      email: 'teste@example.com',
      password: 'senha123',
    };

    userService.createUser.mockRejectedValue(new Error('Email already registered'));

    const response = await request(app)
      .post('/api/register')
      .send(existingUser);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Email already registered');
  });

  it('deve retornar erro ao tentar registrar sem dados completos', async () => {
    const incompleteUser = {
      email: 'teste@example.com',
    };

    userService.createUser.mockRejectedValue(new Error('Error registering user'));

    const response = await request(app)
      .post('/api/register')
      .send(incompleteUser);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error registering user');
  });
});
