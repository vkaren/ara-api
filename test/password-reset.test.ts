const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createPasswordResetToken,
  hashPasswordResetToken,
  PASSWORD_RESET_TTL_MS,
} = require("../api/utils/password-reset");

test("creates a one-hour password reset token with a non-reversible hash", () => {
  const now = 1_700_000_000_000;
  const reset = createPasswordResetToken(now);

  assert.equal(reset.token.length, 64);
  assert.equal(reset.tokenHash.length, 64);
  assert.equal(reset.tokenHash, hashPasswordResetToken(reset.token));
  assert.notEqual(reset.tokenHash, reset.token);
  assert.equal(reset.expiresAt.getTime(), now + PASSWORD_RESET_TTL_MS);
});

test("generates different reset tokens", () => {
  const first = createPasswordResetToken(1_700_000_000_000);
  const second = createPasswordResetToken(1_700_000_000_000);

  assert.notEqual(first.token, second.token);
  assert.notEqual(first.tokenHash, second.tokenHash);
});
