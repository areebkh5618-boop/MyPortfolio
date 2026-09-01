import test from 'node:test';
import assert from 'node:assert/strict';

import { checkCredentials } from '../lib/auth.ts';

test('admin credentials use safe local defaults when env vars are missing', () => {
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD = 'admin12345';
  process.env.ADMIN_SECRET = 'local-development-secret-1234';

  assert.equal(checkCredentials('admin', 'admin12345'), true);
  assert.equal(checkCredentials('admin', 'wrong-password'), false);
});
