
import { serviceFactory } from '../service_factory.js';
import { Html } from '../html.js';

serviceFactory('html', environment => Html.fromTemplate(environment));
