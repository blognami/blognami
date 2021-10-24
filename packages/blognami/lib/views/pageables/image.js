
import { defineView } from 'pinstripe';

defineView('pageables/image', ({ params: { pageable: { type, data } }}) => [
    200, { 'Content-Type': `image/${type}`}, [ data ]
]);
