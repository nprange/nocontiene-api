import { statusSchema } from 'api/v1/schemas/statusSchema';
import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const response = await fetch('http://localhost:3333/api/v1/status');
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const parsedResponseBody = statusSchema.parse(responseBody);

      const parsedUpdatedAt = new Date(
        parsedResponseBody.updated_at
      ).toISOString();
      expect(parsedResponseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(parsedResponseBody.dependencies.database.version).toEqual('16.0');
      expect(parsedResponseBody.dependencies.database.max_connections).toEqual(
        100
      );
      expect(
        parsedResponseBody.dependencies.database.opened_connections
      ).toEqual(1);
    });
  });
});
