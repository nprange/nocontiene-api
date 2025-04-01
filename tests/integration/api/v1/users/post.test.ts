import orchestrator from 'tests/orchestrator';
import { userSchema } from 'api/v1/schemas/userSchema';
import { version as uuidVersion } from 'uuid';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('POST /api/v1/users', () => {
  describe('Anonymous user', () => {
    test('With unique and valid data', async () => {
      const firstName = 'john';
      const lastName = 'doe';
      const username = 'johndoe';
      const email = 'johndoe@gmail.com';
      const password = 'Password@123';

      const response = await fetch('http://localhost:3333/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      const parsedResponseBody = userSchema.parse(responseBody);

      expect(parsedResponseBody).toEqual({
        id: parsedResponseBody.id,
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        created_at: parsedResponseBody.created_at,
        updated_at: parsedResponseBody.updated_at,
      });

      expect(uuidVersion(parsedResponseBody.id)).toBe(4);
      expect(Date.parse(parsedResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(parsedResponseBody.updated_at)).not.toBeNaN();
    });

    test('With duplicated "email"', async () => {
      const body = {
        first_name: 'duplicated',
        last_name: 'email',
        username: 'duplicatedemail',
        email: 'duplicatedemail@gmail.com',
        password: 'Password@123',
      };
      const response1 = await fetch('http://localhost:3333/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch('http://localhost:3333/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          username: 'duplicatedemail2',
          email: 'Duplicatedemail@gmail.com',
        }),
      });
      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: 'ValidationError',
        message: 'This email address is not available.',
        action: 'Choose a different address.',
        status_code: 400,
      });
    });

    test('With duplicated "username"', async () => {
      const body = {
        first_name: 'duplicated',
        last_name: 'username',
        username: 'duplicatedusername',
        email: 'duplicatedusername@gmail.com',
        password: 'Password@123',
      };
      const response1 = await fetch('http://localhost:3333/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch('http://localhost:3333/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          username: 'Duplicatedusername',
          email: 'duplicatedusername2@gmail.com',
        }),
      });
      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: 'ValidationError',
        message: 'This username is not available.',
        action: 'Choose a different username.',
        status_code: 400,
      });
    });
  });
});

afterAll(async () => {
  await orchestrator.closeDatabaseConnection();
});
