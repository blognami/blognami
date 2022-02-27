
import { Sql } from './sql.js';

test('Sql (1)', async () => {
    const renderSql = Sql.createRenderer([]);

    let { strings, interpolatedValues } = await renderSql``;

    expect(strings.length).toBe(1);

    expect(interpolatedValues.length).toBe(0);

});


test('Sql (2)', async () => {
    const renderSql = Sql.createRenderer([]);

    let { strings, interpolatedValues } = await renderSql`${'foo'}`;

    expect(strings.length).toBe(2);

    expect(interpolatedValues.length).toBe(1);

});

test('Sql (3)', async () => {
    const renderSql = Sql.createRenderer([]);

    let { strings, interpolatedValues } = await renderSql`${'foo'}${'bar'}`;

    expect(strings.length).toBe(3);

    expect(interpolatedValues.length).toBe(2);

});

test('Sql (4)', async () => {
    const renderSql = Sql.createRenderer([]);

    let { strings, interpolatedValues } = (await renderSql`${renderSql`foo`}`);

    expect(strings.length).toBe(2);

    expect(interpolatedValues.length).toBe(1);

});

test('Sql (5)', async () => {
    const renderSql = Sql.createRenderer([]);

    let { strings, interpolatedValues } = (await renderSql`${renderSql`foo`}`).flatten();

    expect(strings.length).toBe(1);

    expect(interpolatedValues.length).toBe(0);

});