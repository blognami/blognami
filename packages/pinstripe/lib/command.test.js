import test from "node:test";
import assert from "node:assert";

import { Command } from "./command.js";

test("Command.extractParams", () => {
  // Test with base Command class (no aliases)
  assert.deepEqual(Command.extractParams([]), {});
  assert.deepEqual(Command.extractParams(["-a"]), { a: [] });
  assert.deepEqual(Command.extractParams(["--apple"]), { apple: [] });
  assert.deepEqual(Command.extractParams(["--apple", "--pear"]), {
    apple: [],
    pear: [],
  });
  assert.deepEqual(Command.extractParams(["Hello world!"]), {
    args: ["Hello world!"],
  });
  assert.deepEqual(Command.extractParams(["Hello", "world!"]), {
    args: ["Hello", "world!"],
  });
  assert.deepEqual(
    Command.extractParams([
      "Hello",
      "world!",
      "--apple",
      "--pear",
      "--plum-color",
      "purple",
      "--other-fruit",
      "peach",
      "orange",
    ]),
    {
      args: ["Hello", "world!"],
      apple: [],
      pear: [],
      plumColor: ["purple"],
      otherFruit: ["peach", "orange"],
    }
  );

  // Test with extended class that has aliases
  const TestCommandWithAliases = Command.extend();
  TestCommandWithAliases.hasParam("apple", { type: "boolean", alias: "a" });
  TestCommandWithAliases.hasParam("verbose", { type: "boolean", alias: "v" });
  TestCommandWithAliases.hasParam("help", { type: "boolean", alias: "h" });

  // Test alias resolution
  assert.deepEqual(TestCommandWithAliases.extractParams(["-a"]), { apple: [] });
  assert.deepEqual(TestCommandWithAliases.extractParams(["-v"]), {
    verbose: [],
  });
  assert.deepEqual(TestCommandWithAliases.extractParams(["-h"]), { help: [] });
  assert.deepEqual(TestCommandWithAliases.extractParams(["-a", "-v"]), {
    apple: [],
    verbose: [],
  });

  // Test that non-aliased params still work
  assert.deepEqual(TestCommandWithAliases.extractParams(["--apple"]), {
    apple: [],
  });
  assert.deepEqual(TestCommandWithAliases.extractParams(["--verbose"]), {
    verbose: [],
  });

  // Test mixed aliases and full names
  assert.deepEqual(
    TestCommandWithAliases.extractParams(["-a", "--verbose", "-h"]),
    { apple: [], verbose: [], help: [] }
  );

  // Test positional argument aliases (arg1, arg2, etc.)
  const TestCommandWithArgAliases = Command.extend();
  TestCommandWithArgAliases.hasParam("inputFile", {
    type: "string",
    alias: "arg1",
  });
  TestCommandWithArgAliases.hasParam("outputFile", {
    type: "string",
    alias: "arg2",
  });
  TestCommandWithArgAliases.hasParam("format", {
    type: "string",
    alias: "arg3",
  });

  // Test single positional argument alias
  assert.deepEqual(TestCommandWithArgAliases.extractParams(["input.txt"]), {
    inputFile: ["input.txt"],
  });

  // Test multiple positional argument aliases
  assert.deepEqual(
    TestCommandWithArgAliases.extractParams(["input.txt", "output.txt"]),
    { inputFile: ["input.txt"], outputFile: ["output.txt"] }
  );

  // Test all positional argument aliases
  assert.deepEqual(
    TestCommandWithArgAliases.extractParams([
      "input.txt",
      "output.txt",
      "json",
    ]),
    { inputFile: ["input.txt"], outputFile: ["output.txt"], format: ["json"] }
  );

  // Test positional aliases with extra args (beyond defined aliases)
  assert.deepEqual(
    TestCommandWithArgAliases.extractParams([
      "input.txt",
      "output.txt",
      "json",
      "extra1",
      "extra2",
    ]),
    {
      inputFile: ["input.txt"],
      outputFile: ["output.txt"],
      format: ["json"],
      args: ["extra1", "extra2"],
    }
  );

  // Test positional aliases with gaps (missing middle argument)
  assert.deepEqual(
    TestCommandWithArgAliases.extractParams(["input.txt", "output.txt"]),
    { inputFile: ["input.txt"], outputFile: ["output.txt"] }
  );

  // Test positional aliases mixed with named arguments
  assert.deepEqual(
    TestCommandWithArgAliases.extractParams([
      "input.txt",
      "--verbose",
      "output.txt",
    ]),
    { inputFile: ["input.txt"], verbose: ["output.txt"] }
  );

  // Test empty args array after positional alias processing
  const TestCommandSingleArg = Command.extend();
  TestCommandSingleArg.hasParam("file", { type: "string", alias: "arg1" });

  assert.deepEqual(TestCommandSingleArg.extractParams(["test.txt"]), {
    file: ["test.txt"],
  });

  // Test with sparse args (some positions missing)
  const TestCommandSparseArgs = Command.extend();
  TestCommandSparseArgs.hasParam("firstArg", { type: "string", alias: "arg1" });
  TestCommandSparseArgs.hasParam("thirdArg", { type: "string", alias: "arg3" });

  assert.deepEqual(
    TestCommandSparseArgs.extractParams(["first", "second", "third"]),
    { firstArg: ["first"], thirdArg: ["third"], args: ["second"] }
  );

  // Test edge case: delete operation on args array with sparse indices
  const TestCommandWithGaps = Command.extend();
  TestCommandWithGaps.hasParam("file1", { type: "string", alias: "arg1" });
  TestCommandWithGaps.hasParam("file3", { type: "string", alias: "arg3" });
  TestCommandWithGaps.hasParam("file5", { type: "string", alias: "arg5" });

  assert.deepEqual(
    TestCommandWithGaps.extractParams(["a", "b", "c", "d", "e", "f"]),
    {
      file1: ["a"],
      file3: ["c"],
      file5: ["e"],
      args: ["b", "d", "f"],
    }
  );
});

test("Command.coerceParams", () => {
  const TestCommand = Command.extend();
  TestCommand.hasParam("apple", { type: "boolean", alias: "a" });
  TestCommand.hasParam("pear", { type: "string" });
  TestCommand.hasParam("plumColor", { type: "string" });
  TestCommand.hasParam("otherFruit", { type: "string" });
  TestCommand.hasParam("count", { type: "number", optional: true });
  TestCommand.hasParam("verbose", { type: "boolean", optional: true });
  TestCommand.hasParam("args", { type: "string", optional: true });

  assert.deepEqual(TestCommand.coerceParams({}), {});
  // Note: alias handling is now done in extractParams, so we only test with resolved parameter names
  assert.deepEqual(TestCommand.coerceParams({ apple: [] }), { apple: true });
  assert.deepEqual(TestCommand.coerceParams({ apple: [], pear: [] }), {
    apple: true,
    pear: "",
  });
  assert.deepEqual(TestCommand.coerceParams({ args: ["Hello", "world!"] }), {
    args: "Hello world!",
  });
  assert.deepEqual(
    TestCommand.coerceParams({
      args: ["Hello", "world!"],
      apple: [],
      pear: ["green"],
      plumColor: ["purple"],
      otherFruit: ["peach", "orange"],
    }),
    {
      args: "Hello world!",
      apple: true,
      pear: "green",
      plumColor: "purple",
      otherFruit: "peach orange",
    }
  );
  assert.deepEqual(
    TestCommand.coerceParams({
      args: ["Hello", "world!"],
      apple: [],
      pear: ["green"],
      plumColor: ["purple"],
      otherFruit: ["peach", "orange"],
      count: ["42"],
      verbose: ["false"],
    }),
    {
      args: "Hello world!",
      apple: true,
      pear: "green",
      plumColor: "purple",
      otherFruit: "peach orange",
      count: 42,
      verbose: false,
    }
  );
});

test("Command validation through validate method", async () => {
  // Import Context for testing
  const { Context } = await import("./context.js");
  const { ValidationError } = await import("./validation_error.js");

  // Create a test command with parameters
  const TestCommand = Command.extend();
  TestCommand.hasParam("name", { type: "string" });
  TestCommand.hasParam("count", { type: "number", optional: true });

  const context = Context.new();

  // Test 1: Valid parameters should pass validation
  context.params = { name: "test", count: 42 };
  const command1 = TestCommand.new(context);
  await assert.doesNotReject(async () => {
    await command1.validate();
  });

  // Test 2: Unknown parameter should cause validation error
  // (This is now handled automatically by the on('validation') event)
  context.params = { name: "test", unknownParam: "value" };
  const command2 = TestCommand.new(context);
  await assert.rejects(
    async () => {
      await command2.validate();
    },
    ValidationError,
    "Should throw ValidationError for unknown parameters"
  );

  // Test 3: Missing required parameter should cause validation error
  context.params = { count: 42 }; // missing required 'name'
  const command3 = TestCommand.new(context);
  await assert.rejects(
    async () => {
      await command3.validate();
    },
    ValidationError,
    "Should throw ValidationError for missing required parameters"
  );

  // Test 4: Valid parameters with optional ones missing should pass
  context.params = { name: "test" }; // 'count' is optional
  const command4 = TestCommand.new(context);
  await assert.doesNotReject(async () => {
    await command4.validate();
  });

  // Test 5: Test the error message format for unknown parameters
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
