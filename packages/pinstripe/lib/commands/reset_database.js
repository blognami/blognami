
export default async ({ runCommand }) => {
    await runCommand('drop-database');
    await runCommand('init-database');
};
