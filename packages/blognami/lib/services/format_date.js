
import { DateTime } from 'luxon';

export default {
    create(){
        return (date, format = 'LLL dd, yyyy') => DateTime.fromJSDate(date).toFormat(format);
    }
};
