
export const SELF_CLOSING_TAGS = [
    'area',
    'base',
    'br',
    'embed',
    'hr',
    'iframe',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'slot',
    'source',
    'track'
];

export const TEXT_ONLY_TAGS = [
    'script',
    'style'
];

export const IS_SERVER = typeof window == 'undefined';

export const IS_CLIENT = !IS_SERVER;
