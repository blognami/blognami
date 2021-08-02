
import { defineService } from 'pinstripe';

import { Html } from '../html.js';

defineService('renderHtml', async () => {
    return (...args) => Html.render(...args);
});
