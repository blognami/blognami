const ERROR_MESSAGE = 'The fixture job threw.';

// No schedule: only the `throwing_job` view queues it.
export default {
    run(){
        throw new Error(ERROR_MESSAGE);
    }
};
