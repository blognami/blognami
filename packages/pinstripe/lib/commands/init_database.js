
export default async ({ runCommand }) => {
    await runCommand('create-database');
    await runCommand('migrate-database');
    await runCommand('seed-database');
};
