import { Command } from "./command.js";

[
    { args: [], expectedParams: {} },
    { args: ["-a"], expectedParams: { a: true } },
    { args: ["--apple"], expectedParams: { apple: true } },
    { args: ["--apple", "--pear"], expectedParams: { apple: true, pear: true } },
    { args: ["Hello world!"], expectedParams: { args: "Hello world!" } },
    { args: ["Hello", "world!"], expectedParams: { args: "Hello world!" } },
    {
        args: [
            "Hello", "world!",
            "--apple",
            "--pear",
            "--plum-color", "purple",
            "--other-fruit", "peach", "orange",
        ],
        expectedParams: {
            args: "Hello world!",
            apple: true,
            pear: true,
            plumColor: "purple",
            otherFruit: "peach orange",
        },
    },
].forEach(({ args, expectedParams }, i) => {
    test(`Command.extractParams (${i}})`, () => {
        expect(Command.extractParams(args)).toStrictEqual(expectedParams);
    });
});


