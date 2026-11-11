const test = require("node:test");
const assert = require("node:assert/strict");
const Joi = require("joi");
const validatorHandler = require("../api/middlewares/validator.handler");

test("continues when the data is valid", () => {
  const nextCalls = [];
  const middleware = validatorHandler(
    Joi.object({ id: Joi.number().required() }),
    "params"
  );

  middleware({ params: { id: 1 } }, {}, (error) => nextCalls.push(error));

  assert.deepEqual(nextCalls, [undefined]);
});

test("stops the chain when the data is invalid", () => {
  const nextCalls = [];
  const middleware = validatorHandler(
    Joi.object({ id: Joi.number().required() }),
    "params"
  );

  middleware({ params: { id: "invalid" } }, {}, (error) => nextCalls.push(error));

  assert.equal(nextCalls.length, 1);
  assert.equal(nextCalls[0].isBoom, true);
  assert.equal(nextCalls[0].output.statusCode, 400);
});
