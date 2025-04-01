import orchestrator from 'tests/orchestrator';
import { userSchema } from 'api/v1/schemas/userSchema';
import { version as uuidVersion } from 'uuid';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /api/v1/users/[username]', () => {
  describe('Anonymous user', () => {
    test('With exact case match', async () => {
      const body = {
        first_name: 'Match',
        last_name: 'Case',
        username: 'MatchCase',
        email: 'match.case@gmail.com',
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

      const response2 = await fetch(
        'http://localhost:3333/api/v1/users/MatchCase'
      );
      expect(response2.status).toBe(200);
      const response2Body = await response2.json();
      const parsedResponse2Body = userSchema.parse(response2Body);

      expect(parsedResponse2Body).toEqual({
        id: parsedResponse2Body.id,
        username: body.username,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        created_at: parsedResponse2Body.created_at,
        updated_at: parsedResponse2Body.updated_at,
      });

      expect(uuidVersion(parsedResponse2Body.id)).toBe(4);
      expect(Date.parse(parsedResponse2Body.created_at)).not.toBeNaN();
      expect(Date.parse(parsedResponse2Body.updated_at)).not.toBeNaN();
    });

    test('With case mismatch', async () => {
      const body = {
        first_name: 'Case',
        last_name: 'Mismatch',
        username: 'CaseMismatch',
        email: 'case.mismatch@gmail.com',
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

      const response2 = await fetch(
        'http://localhost:3333/api/v1/users/casemismatch'
      );
      expect(response2.status).toBe(200);
      const response2Body = await response2.json();
      const parsedResponse2Body = userSchema.parse(response2Body);

      expect(parsedResponse2Body).toEqual({
        id: parsedResponse2Body.id,
        username: body.username,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        created_at: parsedResponse2Body.created_at,
        updated_at: parsedResponse2Body.updated_at,
      });

      expect(uuidVersion(parsedResponse2Body.id)).toBe(4);
      expect(Date.parse(parsedResponse2Body.created_at)).not.toBeNaN();
      expect(Date.parse(parsedResponse2Body.updated_at)).not.toBeNaN();
    });

    test('With nonexistent username', async () => {
      const response = await fetch(
        'http://localhost:3333/api/v1/users/NonexistentUser'
      );
      expect(response.status).toBe(404);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: 'NotFoundError',
        message: 'The informed username was not found.',
        action: 'Verify if the username is correct and try again.',
        status_code: 404,
      });
    });
  });
});

afterAll(async () => {
  await orchestrator.closeDatabaseConnection();
});
