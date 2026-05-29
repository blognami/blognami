import test from "node:test";
import assert from "node:assert";

import { Command } from "./command.js";

test("Command validation through validate method", async () => {
  const { Context } = await import("haberdash");
  const { ValidationError } = await import("haberdash");

  const TestCommand = Command.extend();
  TestCommand.hasParam("name", { type: "string" });
  TestCommand.hasParam("count", { type: "number", optional: true });

  const context = Context.new();

  context.params = { name: "test", count: 42 };
  const command1 = TestCommand.new(context);
  await assert.doesNotReject(async () => {
    await command1.validate();
  });

  context.params = { name: "test", unknownParam: "value" };
  const command2 = TestCommand.new(context);
  await assert.rejects(
    async () => {
      await command2.validate();
    },
    ValidationError,
    "Should throw ValidationError for unknown parameters"
  );

  context.params = { count: 42 };
  const command3 = TestCommand.new(context);
  await assert.rejects(
    async () => {
      await command3.validate();
    },
    ValidationError,
    "Should throw ValidationError for missing required parameters"
  );

  context.params = { name: "test" };
  const command4 = TestCommand.new(context);
  await assert.doesNotReject(async () => {
    await command4.validate();
  });

  context.params = { name: "test", badParam: "value" };
  const command5 = TestCommand.new(context);
  try {
    await command5.validate();
    assert.fail("Expected validation to throw");
  } catch (error) {
    assert(error instanceof ValidationError, "Should be ValidationError");
    assert(error.errors, "Should have errors property");
    assert(error.errors.badParam, "Should have badParam error");
    assert(
      error.errors.badParam.includes("Unknown parameter"),
      `Expected error message to contain "Unknown parameter", but got: ${error.errors.badParam}`
    );
  }
});

test("Pinstripe Command has binaryName 'pinstripe'", () => {
  assert.equal(Command.binaryName, "pinstripe");
});

test("Pinstripe Command has list-commands registered", () => {
  assert(Command.names.includes("list-commands"), "list-commands should be registered");
});
