// Small, so the test of the file-size refusal posts kilobytes and not the default 10 MiB.
const FILE_SIZE_LIMIT = 1024;

// The sender the test of the sign-in form reads back from the simulated message.
const MAIL_FROM = 'noreply@example.com';

export default {
    server: {
        limits: {
            fileSize: FILE_SIZE_LIMIT
        }
    },
    mail: {
        defaults: {
            from: MAIL_FROM
        }
    }
};
