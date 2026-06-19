
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
    'track',
    'wbr'
];

export const TEXT_ONLY_TAGS = [
    'script',
    'style'
];

// CommonMark "type 6" block-level tag names — a top-level line beginning with
// one of these (or a comment / declaration) starts a raw HTML block. The
// raw-text tags (script, style, pre, textarea) are deliberately excluded:
// their content can contain blank lines, which the blank-line block terminator
// would truncate, so they stay inline as before.
export const BLOCK_LEVEL_TAGS = [
    'address', 'article', 'aside', 'base', 'basefont', 'blockquote', 'body',
    'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dialog', 'dir',
    'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
    'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
    'hr', 'html', 'iframe', 'legend', 'li', 'link', 'main', 'menu', 'menuitem',
    'nav', 'noframes', 'ol', 'optgroup', 'option', 'p', 'param', 'section',
    'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title', 'tr',
    'track', 'ul'
];

export const IS_SERVER = typeof window == 'undefined' && typeof addEventListener == 'undefined';

export const IS_CLIENT = !IS_SERVER;
