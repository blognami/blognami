import test from "node:test";
import assert from "node:assert";
import chalk from "chalk";

import { Class } from "./class.js";
import { Context } from "./context.js";
import { AbstractCommand } from "./abstract_command.js";
import { AbstractServiceFactory } from "./abstract_service_factory.js";

const Command = Class.extend().include({ meta(){ this.include(AbstractCommand); } });

// A command's this.params is supplied by the params service inherited from
// AbstractServiceFactory, resolved through the ServiceFactory.Consumerable trap.
const ServiceFactory = Class.extend().include({
  meta(){ this.include(AbstractServiceFactory); this.include(this.Consumerable); }
});

const contextWithParams = (params = {}) => {
  const context = Context.new();
  context.params = params;
  return context;
};

test("Command.extractParams", () => {
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

  const TestCommandWithAliases = Command.extend();
  TestCommandWithAliases.hasParam("apple", { type: "boolean", alias: "a" });
  TestCommandWithAliases.hasParam("verbose", { type: "boolean", alias: "v" });
  TestCommandWithAliases.hasParam("help", { type: "boolean", alias: "h" });

  assert.deepEqual(TestCommandWithAliases.extractParams(["-a"]), { apple: [] });
  assert.deepEqual(TestCommandWithAliases.extractParams(["-v"]), {
    verbose: [],
  });
  assert.deepEqual(TestCommandWithAliases.extractParams(["-h"]), { help: [] });
  assert.deepEqual(TestCommandWithAliases.extractParams(["-a", "-v"]), {
    apple: [],
    verbose: [],
  });

  assert.deepEqual(TestCommandWithAliases.extractParams(["--apple"]), {
    apple: [],
  });
  assert.deepEqual(TestCommandWithAliases.extractParams(["--verbose"]), {
    verbose: [],
  });

  assert.deepEqual(
    TestCommandWithAliases.extractParams(["-a", "--verbose", "-h"]),
    { apple: [], verbose: [], help: [] }
  );

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

  assert.deepEqual(TestCommandWithArgAliases.extractParams(["input.txt"]), {
    inputFile: ["input.txt"],
  });

  assert.deepEqual(
    TestCommandWithArgAliases.extractParams(["input.txt", "output.txt"]),
    { inputFile: ["input.txt"], outputFile: ["output.txt"] }
  );

  assert.deepEqual(
    TestCommandWithArgAliases.extractParams([
      "input.txt",
      "output.txt",
      "json",
    ]),
    { inputFile: ["input.txt"], outputFile: ["output.txt"], format: ["json"] }
  );

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

  assert.deepEqual(
    TestCommandWithArgAliases.extractParams(["input.txt", "output.txt"]),
    { inputFile: ["input.txt"], outputFile: ["output.txt"] }
  );

  assert.deepEqual(
    TestCommandWithArgAliases.extractParams([
      "input.txt",
      "--verbose",
      "output.txt",
    ]),
    { inputFile: ["input.txt"], verbose: ["output.txt"] }
  );

  const TestCommandSingleArg = Command.extend();
  TestCommandSingleArg.hasParam("file", { type: "string", alias: "arg1" });

  assert.deepEqual(TestCommandSingleArg.extractParams(["test.txt"]), {
    file: ["test.txt"],
  });

  const TestCommandSparseArgs = Command.extend();
  TestCommandSparseArgs.hasParam("firstArg", { type: "string", alias: "arg1" });
  TestCommandSparseArgs.hasParam("thirdArg", { type: "string", alias: "arg3" });

  assert.deepEqual(
    TestCommandSparseArgs.extractParams(["first", "second", "third"]),
    { firstArg: ["first"], thirdArg: ["third"], args: ["second"] }
  );

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

test("help and interactive params are declared on the base command", () => {
  assert.deepEqual(Command.extractParams(["-h"]), { help: [] });
  assert.deepEqual(Command.extractParams(["-i"]), { interactive: [] });
  assert.deepEqual(Command.coerceParams(Command.extractParams(["-h"])), {
    help: true,
  });
  assert.deepEqual(Command.coerceParams(Command.extractParams(["--interactive"])), {
    interactive: true,
  });
});

test("Command params are inherited from ancestor classes", () => {
  const Registry = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
  Registry.hasParam("branch", { type: "string", optional: true });

  Registry.register("deploy", {
    meta(){
      this.hasParam("target", { type: "string", alias: "arg1", optional: true });
    }
  });
  const Deploy = Registry.for("deploy");

  assert.deepEqual(Object.keys(Deploy.params).sort(), ["branch", "help", "interactive", "target"]);

  assert.deepEqual(Object.keys(Registry.params), ["help", "interactive", "branch"]);

  assert.deepEqual(
    Deploy.coerceParams(Deploy.extractParams(["production", "--branch", "foo"])),
    { target: "production", branch: "foo" }
  );

  Registry.register("override", {
    meta(){
      this.hasParam("branch", { type: "boolean", optional: true });
    }
  });
  assert.equal(Registry.for("override").params.branch.type, "boolean");
  assert.equal(Registry.params.branch.type, "string");
});

test("inherited required params fail validation when missing", async () => {
  const Registry = Class.extend().include({ meta(){ this.include(AbstractCommand); this.include(ServiceFactory.Consumerable); } });
  Registry.hasParam("tenant", { type: "string" });
  Registry.register("deploy", {});

  const command = Registry.for("deploy").new();
  command.context = contextWithParams({});
  await assert.rejects(
    () => command.validate(),
    error => error.errors?.tenant === "Must not be blank"
  );

  command.context = contextWithParams({ tenant: "acme" });
  await command.validate();
});

test("AbstractCommand includes list-commands by default", () => {
  const MyCommand = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
  assert(MyCommand.names.includes("list-commands"), "list-commands should be registered");
});

test("AbstractCommand default binaryName is 'command'", () => {
  const MyCommand = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
  assert.equal(MyCommand.binaryName, "command");
});

test("AbstractCommand binaryName can be overridden", () => {
  const MyCommand = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
  MyCommand.binaryName = "mycli";
  assert.equal(MyCommand.binaryName, "mycli");
});

test("list-commands declares the 'filter' param", () => {
  const MyCommand = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
  const ListCommands = MyCommand.for("list-commands");
  assert.deepEqual(ListCommands.extractParams(["san"]), { filter: ["san"] });
  assert.deepEqual(ListCommands.extractParams(["--filter", "san"]), { filter: ["san"] });
  assert.deepEqual(
    ListCommands.coerceParams(ListCommands.extractParams(["san"])),
    { filter: "san" }
  );
  assert.deepEqual(
    ListCommands.coerceParams(ListCommands.extractParams(["--filter", "san"])),
    { filter: "san" }
  );
});

test("list-commands fuzzy-filters by name, highlights matches, and handles no-match", () => {
  const MyCommand = Class.extend().include({ meta(){ this.include(AbstractCommand); this.include(ServiceFactory.Consumerable); } });
  MyCommand.register("run-in-sandbox", {});
  MyCommand.register("start-sandbox", {});
  MyCommand.register("generate-command", {});
  MyCommand.register("santiago", {});

  const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
  const UNDERLINE = "\x1b[4m";
  const captureRun = (params) => {
    const raw = [];
    const original = console.log;
    const originalLevel = chalk.level;
    chalk.level = 1;
    console.log = (...args) => raw.push(args.join(" "));
    try {
      const command = MyCommand.for("list-commands").new();
      command.context = contextWithParams(params);
      command.run();
    } finally {
      console.log = original;
      chalk.level = originalLevel;
    }
    return { raw, plain: raw.map(stripAnsi) };
  };

  // Unfiltered: no highlighting, no "matching" header, help footer present.
  const all = captureRun({});
  assert.ok(all.plain.includes("The following commands are available:"));
  assert.ok(all.plain.includes("  * run-in-sandbox"));
  assert.ok(all.plain.includes("  * start-sandbox"));
  assert.ok(all.plain.includes("  * generate-command"));
  assert.ok(all.plain.includes("  * santiago"));
  assert.ok(all.plain.includes("  * list-commands"));
  assert.ok(all.plain.includes("For more information on a specific command, run:"));
  assert.ok(all.plain.some(l => l.includes("COMMAND_NAME --help")), "help footer renders the COMMAND_NAME --help hint");
  assert.ok(!all.raw.some(l => l.includes(UNDERLINE)), "no underline codes in unfiltered output");

  // Filtered with 'san': matches names containing 'san'; highlight the substring.
  const filtered = captureRun({ filter: "san" });
  assert.ok(filtered.plain.includes("The following commands matching 'san' are available:"));
  assert.ok(filtered.plain.includes("  * run-in-sandbox"));
  assert.ok(filtered.plain.includes("  * start-sandbox"));
  assert.ok(filtered.plain.includes("  * santiago"));
  assert.ok(!filtered.plain.some(l => l.includes("generate-command")), "non-matching command excluded");
  assert.ok(filtered.plain.includes("For more information on a specific command, run:"), "help footer still renders when filtered");
  // Underline applied within the command name (e.g. run-in-sandbox).
  const sandboxLine = filtered.raw.find(l => stripAnsi(l) === "  * run-in-sandbox");
  assert.ok(sandboxLine, "found run-in-sandbox line");
  assert.ok(sandboxLine.includes(`${UNDERLINE}san\x1b[24m`), "name substring 'san' is underlined");

  // Case-insensitive matching highlights.
  const upper = captureRun({ filter: "SAN" });
  const upperLine = upper.raw.find(l => stripAnsi(l) === "  * run-in-sandbox");
  assert.ok(upperLine.includes(`${UNDERLINE}san\x1b[24m`), "case-insensitive filter still underlines original-case substring");

  // No-match: print 'No commands matching ...' with no 'available' header; don't throw; still prints help footer.
  let noMatch;
  assert.doesNotThrow(() => {
    noMatch = captureRun({ filter: "zzz" });
  });
  assert.ok(noMatch.plain.includes("  No commands matching 'zzz'."));
  assert.ok(!noMatch.plain.some(l => l.includes("available:")), "no 'available' header when no matches");
  assert.ok(noMatch.plain.includes("For more information on a specific command, run:"), "help footer still renders on no-match");
});
