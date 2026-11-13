const test = require("node:test");
const assert = require("node:assert/strict");
const Joi = require("joi");
const validatorHandler = require("../api/middlewares/validator.handler");

test("continues when the data is valid", () => {
  const nextCalls: unknown[] = [];
  const middleware = validatorHandler(
    Joi.object({ id: Joi.number().required() }),
    "params"
  );

  middleware({ params: { id: 1 } }, {}, (error: unknown) => nextCalls.push(error));

  assert.deepEqual(nextCalls, [undefined]);
});

test("stops the chain when the data is invalid", () => {
  const nextCalls: unknown[] = [];
  const middleware = validatorHandler(
    Joi.object({ id: Joi.number().required() }),
    "params"
  );

  middleware(
    { params: { id: "invalid" } },
    {},
    (error: unknown) => nextCalls.push(error)
  );

  assert.equal(nextCalls.length, 1);
  const validationError = nextCalls[0] as {
    isBoom: boolean;
    output: { statusCode: number };
  };
  assert.equal(validationError.isBoom, true);
  assert.equal(validationError.output.statusCode, 400);
});
