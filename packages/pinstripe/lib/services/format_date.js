
import { DateTime } from 'luxon';

export default () => {
    return (date, format = 'LLL dd, yyyy') => DateTime.fromJSDate(date).toFormat(format);
};
