import test from 'node:test';
import assert from 'node:assert';

import { Text } from "./text.js";

[
    {
        fn({ line }){
            line('apple');
        },
        expectedValue: 'apple'
    },
    {
        fn({ line }){
            line('apple');
            line('pear');
        },
        expectedValue: 'apple\npear'
    },
    {
        fn({ line }){
            line(Promise.resolve('apple'));
        },
        expectedValue: 'apple'
    },
    {
        fn({ line }){
            line(Promise.resolve('apple'));
            line(Promise.resolve('pear'));
        },
        expectedValue: 'apple\npear'
    },
    {
        fn({ line }){
            line(Promise.resolve('apple'));
            line('pear');
        },
        expectedValue: 'apple\npear'
    },
    {
        fn({ echo }){
            echo('apple');
        },
        expectedValue: 'apple'
    },
    {
        fn({ echo }){
            echo('apple');
            echo('pear')
        },
        expectedValue: 'applepear'
    },
    {
        fn({ echo }){
            echo(Promise.resolve('apple'));
        },
        expectedValue: 'apple'
    },
    {
        fn({ echo }){
            echo(Promise.resolve('apple'));
            echo(Promise.resolve('pear'))
        },
        expectedValue: 'applepear'
    },
    {
        fn({ echo }){
            echo(Promise.resolve('apple'));
            echo('pear')
        },
        expectedValue: 'applepear'
    },
    {
        fn({ indent }){
            indent(({ line }) => {
                line('apple');
            })
        },
        expectedValue: '    apple'
    },
    {
        fn({ indent }){
            indent(({ line }) => {
                line('apple');
                line('pear');
            })
        },
        expectedValue: '    apple\n    pear'
    },
    {
        fn({ line, indent }){
            line('apple');
            indent(({ line }) => {
                line('pear');
                line('plum');
            })
        },
        expectedValue: 'apple\n    pear\n    plum'
    },
    {
        fn({ line, indent }){
            line('apple');
            indent(({ line }) => {
                line(Promise.resolve('pear'));
                line('plum');
            })
        },
        expectedValue: 'apple\n    pear\n    plum'
    },
    {
        fn({ line, indent }){
            line('apple');
            indent(({ line, indent }) => {
                line('pear');
                indent(({ line }) => {
                    line('orange');
                });
                line('plum');
            })
            line('banana');
        },
        expectedValue: 'apple\n    pear\n        orange\n    plum\nbanana'
    },
    {
        fn({ line, indent }){
            line('apple');
            indent(({ line, indent }) => {
                line(Promise.resolve('pear'));
                indent(({ line }) => {
                    line('orange');
                    line(Promise.resolve('grape'));
                    line('kiwi');
                });
                line(Promise.resolve('plum'));
            })
            line('banana');
        },
        expectedValue: 'apple\n    pear\n        orange\n        grape\n        kiwi\n    plum\nbanana'
    },
].forEach(({ fn, expectedValue }, i) => {
    test(`Text.render (${i}})`, async () => {
        assert.equal(await Text.render(fn).then(text => text.toString()), expectedValue);
    });
});


