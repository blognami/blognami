
import { escapeHtml } from './escape_html.js';
import { unescapeHtml } from './unescape_html.js';
import { StringScanner } from './string_scanner.js';
import { SELF_CLOSING_TAGS, TEXT_ONLY_TAGS, BLOCK_LEVEL_TAGS } from './constants.js';
import { Class } from './class.js';
import { Hookable } from './hookable.js';
import { defer } from './defer.js';

const CloseTag = Class.extend('CloseTag').include({
    initialize(type){
        this.type = type;
    }
});

const ASCII_PUNCTUATION = /[!-\/:-@\[-`{-~]/;

// CommonMark flanking rules. `before` / `after` are the characters surrounding
// the delimiter run ('' means start/end of input, treated as whitespace).
const flanking = (marker, before, after) => {
    const beforeWs = before === '' || /\s/.test(before);
    const afterWs = after === '' || /\s/.test(after);
    const beforePunct = before !== '' && ASCII_PUNCTUATION.test(before);
    const afterPunct = after !== '' && ASCII_PUNCTUATION.test(after);

    const leftFlanking = !afterWs && (!afterPunct || beforeWs || beforePunct);
    const rightFlanking = !beforeWs && (!beforePunct || afterWs || afterPunct);

    if(marker == '_'){
        // the canSplitWord guard: `_` may not open/close intraword
        return {
            canOpen: leftFlanking && (!rightFlanking || beforePunct),
            canClose: rightFlanking && (!leftFlanking || afterPunct)
        };
    }
    return { canOpen: leftFlanking, canClose: rightFlanking };
};

// Top-level raw-HTML block opener: a line beginning (after up to 3 spaces) with
// a comment / declaration (`<!`) or a block-level open/close tag. The
// `(?![a-zA-Z0-9-])` lookahead anchors the end of the tag name — so `<div`
// matches but `<divx` does not, and autolinks (`<https://…>`, `<foo@bar.com>`)
// fall through because `:` / `@` is not a valid tag-name terminator.
const HTML_BLOCK_OPEN = new RegExp(
    '^ {0,3}(?:<!|<\\/?(?:' + BLOCK_LEVEL_TAGS.join('|') + ')(?![a-zA-Z0-9-]))'
);

// Block-start probe: does `input` begin with a line that starts a new container
// or leaf block? Used both by the paragraph collector to stop, and (negated) by
// the lazy-continuation predicate to fold unprefixed lines into an open
// blockquote / list item.
const startsBlock = input =>
    /^[ \t]*(?:\n|$)/.test(input) ||
    /^ {0,3}#{1,6}(?:[ \t]|$)/.test(input) ||
    /^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}(?:\n|$)/.test(input) ||
    /^ {0,3}(?:```+|~~~+)/.test(input) ||
    /^ {0,3}>/.test(input) ||
    /^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+/.test(input) ||
    HTML_BLOCK_OPEN.test(input);

// CommonMark lazy continuation: a non-blank line that doesn't itself start a
// new block can fold into an open container's paragraph across a missing
// prefix. Shared by the blockquote collector and (eventually) the list-item
// collector — one definition of "lazy line" across both containers.
const isLazyContinuation = input => input.length > 0 && !startsBlock(input);

// Split a GFM pipe-table row into trimmed cells. Outer pipes are optional;
// `\|` is treated as a literal `|` inside a cell.
const splitTableRow = line => {
    let remaining = line.replace(/^[ \t]+|[ \t]+$/g, '');
    if(remaining.startsWith('|')) remaining = remaining.slice(1);
    if(remaining.endsWith('|') && !remaining.endsWith('\\|')) remaining = remaining.slice(0, -1);
    const cells = [];
    let cell = '';
    for(let position = 0; position < remaining.length; position++){
        if(remaining[position] === '\\' && remaining[position + 1] === '|'){
            cell += '|';
            position++;
        } else if(remaining[position] === '|'){
            cells.push(cell.trim());
            cell = '';
        } else {
            cell += remaining[position];
        }
    }
    cells.push(cell.trim());
    return cells;
};

// Parse a delimiter cell: returns 'left'/'center'/'right' from colon markers,
// null for an unaligned but valid cell, or undefined when the cell is not a
// valid delimiter (which invalidates the whole table candidate).
const parseTableAlign = cell => {
    const match = cell.match(/^(:?)-+(:?)$/);
    if(!match) return undefined;
    if(match[1] && match[2]) return 'center';
    if(match[1]) return 'left';
    if(match[2]) return 'right';
    return null;
};

// Match a GFM table's header+delimiter rows without consuming. Returns
// { headerCells, alignments } when line 1 has a `|` and line 2 is a valid
// delimiter row with matching cell count, or null otherwise.
const matchTableHead = scanner => {
    const headerLine = scanner.matchLine();
    if(!headerLine.includes('|')) return null;
    const afterHeader = scanner.string.slice(headerLine.length + 1);
    const delimLine = afterHeader.split('\n', 1)[0];
    const headerCells = splitTableRow(headerLine);
    const alignments = splitTableRow(delimLine).map(parseTableAlign);
    if(alignments.length !== headerCells.length) return null;
    if(alignments.some(alignment => alignment === undefined)) return null;
    return { headerCells, alignments };
};

// Title delimiters for an inline link/image destination, keyed by their opening
// char. Each pattern captures the title content up to the first matching close.
const titlePatterns = {
    '(': /^\(([^)]*)\)/,
    '"': /^"([^"]*)"/,
    "'": /^'([^']*)'/
};

// Parse the inside of an inline link/image's `(...)` destination block,
// starting just past the opening `(`. Returns { href, title, length } where
// `length` is the number of chars consumed (including the closing `)`), or
// null on any malformed input — letting the caller fall back to literal.
//   - destination: `<…>` (spaces URL-encoded to `%20`) or a bare run of
//     non-whitespace chars with balanced parens.
//   - title: optional, whitespace-separated, delimited by `"…"`, `'…'`, or
//     `(…)` — first matching close terminates.
const parseLinkDestination = input => {
    const scanner = new StringScanner(input);
    scanner.scan(/^\s*/);

    let href;
    const angle = scanner.scan(/^<([^<>\n]*)>/);
    if(angle){
        href = angle[1].replace(/ /g, '%20');
    } else {
        href = '';
        let depth = 0;
        while(scanner.length > 0){
            const chunk = scanner.scan(/^[^\s()]+/);
            if(chunk) href += chunk[0];
            if(scanner.scan(/^\(/)){
                depth++;
                href += '(';
            } else if(depth > 0 && scanner.scan(/^\)/)){
                depth--;
                href += ')';
            } else {
                break;
            }
        }
    }

    let title;
    const hadSpace = scanner.scan(/^\s+/);
    if(hadSpace && scanner.length > 0 && !scanner.match(/^\)/)){
        const pattern = titlePatterns[scanner.string[0]];
        if(!pattern) return null;
        const matched = scanner.scan(pattern);
        if(!matched) return null;
        title = matched[1];
        scanner.scan(/^\s*/);
    }

    if(!scanner.scan(/^\)/)) return null;
    return { href, title, length: input.length - scanner.length };
};

export const MarkupNode = Class.extend('MarkupNode').include({
    meta(){
        this.include(Hookable);

        this.assignProps({
            // Build a node by parsing a string of HTML. Returns a deferred so
            // the async render() chain can be awaited in one go.
            fromHtml(html){
                return defer(() => new this().appendHtml(html));
            },

            // Build a node by parsing a Markdown document string. Returns a
            // deferred so the async render() chain can be awaited in one go.
            fromMarkdown(markdown){
                return defer(() => new this().appendMarkdown(markdown));
            },

            // Parse Markdown and lower it to an HTML string in one call. By
            // default the rendered tree is sanitised (raw HTML neutralised,
            // dangerous URL schemes stripped); pass { sanitize: false } to skip.
            async renderMarkdown(markdown, { sanitize = true } = {}){
                const node = await this.fromMarkdown(markdown).render();
                if(sanitize) node.sanitize();
                return node.toString();
            },

            deserialize(o, parent = null){
                const { type, attributes, safe, children } = typeof o == 'string' ? JSON.parse(o) : o;
                const out = new this(parent, type, attributes);
                out.safe = Boolean(safe);
                out.children = children.map(
                    child => this.deserialize(child, out)
                );
                return out;
            }
        });
    },

    initialize(parent = null, type = '#fragment', attributes = {}){
        this.parent = parent;
        this.type = type;
        this.attributes = attributes;
        this.children = [];
        this.safe = false;
    },

    get text(){
        const out = [];
        this.traverse(node => {
            if(node.type == '#text'){
                out.push(node.attributes.value);
            }
        });
        return out.join('');
    },

    appendNode(type, attributes = {}){
        const out = new this.constructor(this, type, attributes);
        this.children.push(out);
        return out;
    },

    // Public entry point: parse a string of HTML into child nodes. A top-level
    // unmatched close tag throws CloseTag from the worker; the loop swallows it
    // and resumes on the rest of the input.
    appendHtml(html, options = {}){
        const scanner = new StringScanner(html);
        while(scanner.length > 0){
            try {
                this.consumeHtml(scanner, options);
            } catch(e){
                if(e instanceof CloseTag){
                    //do nothing
                } else {
                    throw e;
                }
            }
        }
        return this;
    },

    // Worker: consume tokens from a live scanner into child nodes. Recurses on
    // nested tags and emphasis; propagates CloseTag up to the matching ancestor.
    consumeHtml(scanner, options){
        const { parseInlineMarkdown } = options;

        while(scanner.length > 0){
            const before = scanner.previousChar;   // char left of the cursor, captured pre-scan
            let matches;

            if(matches = scanner.scan(parseInlineMarkdown ? /^[^<*_`\[\\!~\n]+/ : /^[^<]+/)){
                const text = unescapeHtml(matches[0]);
                if(parseInlineMarkdown){
                    // Linkify bare http(s):// URLs and emails on the text branch
                    // only — code spans, link destinations, and HTML attributes
                    // go through other branches and stay untouched. Scope is
                    // intentionally reduced to http(s):// URLs and emails (no
                    // bare domains, `www.`-only, or fuzzy TLD heuristics).
                    const linkRe = /https?:\/\/\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                    let cursor = 0;
                    let match;
                    while((match = linkRe.exec(text)) !== null){
                        if(match.index > cursor){
                            this.appendNode('#text', {value: text.slice(cursor, match.index)});
                        }
                        const matched = match[0];
                        const href = matched.includes('@') ? `mailto:${matched}` : matched;
                        this.appendNode('markdown-link', {href}).appendNode('#text', {value: matched});
                        cursor = match.index + matched.length;
                    }
                    if(cursor < text.length){
                        this.appendNode('#text', {value: text.slice(cursor)});
                    }
                } else {
                    this.appendNode('#text', {value: text});
                }
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^\n/))){
                // CommonMark hard line break: a text run that ended in 2+ spaces.
                // The text-run regex stops at `\n` so the trailing spaces are
                // visible on the preceding `#text` here — trim them and emit
                // `markdown-hard-break`. Otherwise keep the newline as a soft
                // break (literal `\n` in text).
                const lastChild = this.children[this.children.length - 1];
                if(lastChild && lastChild.type == '#text' && / {2,}$/.test(lastChild.attributes.value)){
                    lastChild.attributes.value = lastChild.attributes.value.replace(/ +$/, '');
                    this.appendNode('markdown-hard-break');
                } else {
                    this.appendNode('#text', {value: '\n'});
                }
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^\\\n/))){
                // CommonMark hard line break, backslash form: `\` immediately
                // before `\n`. Separate from the `\\([punct])` escape branch
                // below because `\n` isn't ASCII punctuation.
                this.appendNode('markdown-hard-break');
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^\\([!-\/:-@\[-`{-~])/))){
                this.appendNode('#text', {value: matches[1]});
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^(`+)/))){
                const closingPattern = new RegExp('^([\\s\\S]*?)' + matches[1] + '(?!`)');
                let innerMatch;
                if(innerMatch = scanner.scan(closingPattern)){
                    let value = innerMatch[1];
                    if(value.length >= 2 && value.startsWith(' ') && value.endsWith(' ') && /[^ ]/.test(value)){
                        value = value.slice(1, -1);
                    }
                    this.appendNode('markdown-code').appendNode('#text', {value});
                } else {
                    this.appendNode('#text', {value: matches[0]});
                }
            } else if(parseInlineMarkdown && (matches = scanner.match(/^(!?)\[([^\]]*)\]\(/))){
                const isImage = matches[1] === '!';
                const label = matches[2];
                const destination = parseLinkDestination(scanner.string.slice(matches[0].length));
                if(destination){
                    const linkLength = matches[0].length + destination.length;
                    scanner.scan(new RegExp('^[\\s\\S]{' + linkLength + '}'));
                    const attributes = isImage ? {src: destination.href, alt: label} : {href: destination.href};
                    if(destination.title !== undefined) attributes.title = destination.title;
                    if(isImage){
                        this.appendNode('markdown-image', attributes);
                    } else {
                        this.appendNode('markdown-link', attributes).appendHtml(label, options);
                    }
                } else {
                    scanner.scan(isImage ? /^!\[/ : /^\[/);
                    this.appendNode('#text', {value: isImage ? '![' : '['});
                }
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^([*_])\1*/))){
                const delimiterRun = matches[0];
                const marker = matches[1];
                // run is now consumed; `before` still holds the char to its left,
                // scanner.string.charAt(0) is the char to its right
                const { canOpen, canClose } = flanking(marker, before, scanner.string.charAt(0));
                // Decompose the run length into a nested type list. Strong-greedy
                // (pairs of `markdown-strong`, then a trailing `markdown-em` if
                // odd), with length 3 special-cased to `em` outside `strong` so
                // `***x***` keeps its bold-italic shape. closeType matches the
                // outermost decomposed type — symmetric runs throw one CloseTag
                // which the innermost matching ancestor catches; the rest of
                // the nesting unwinds naturally as recursive appendEmphasis
                // calls return.
                let types;
                if(delimiterRun.length == 3){
                    types = ['markdown-em', 'markdown-strong'];
                } else {
                    types = [];
                    let remaining = delimiterRun.length;
                    while(remaining >= 2){ types.push('markdown-strong'); remaining -= 2; }
                    if(remaining == 1) types.push('markdown-em');
                }
                const closeType = types[0];
                if(canClose && this.hasOpenEmphasis(closeType, marker)){
                    throw new CloseTag(closeType);
                } else if(canOpen){
                    this.appendEmphasis(types, marker, scanner, options);
                } else {
                    this.appendNode('#text', {value: delimiterRun});
                }
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^~~/))){
                // GFM strikethrough — `~~`-only (no 1–3 run like `*`/`_`). Uses
                // the same reduced CloseTag pairing as emphasis: nearest open
                // ancestor of the same type. Marker `~` falls to the default
                // flanking rule (no intraword guard). Lone `~` stays literal.
                const marker = '~';
                const { canOpen, canClose } = flanking(marker, before, scanner.string.charAt(0));
                if(canClose && this.hasOpenEmphasis('markdown-strikethrough', marker)){
                    throw new CloseTag('markdown-strikethrough');
                } else if(canOpen){
                    this.appendEmphasis(['markdown-strikethrough'], marker, scanner, options);
                } else {
                    this.appendNode('#text', {value: matches[0]});
                }
            } else if(matches = scanner.scan(/^<!DOCTYPE[^>]*>/i)){
                if(!this.parent){
                    this.appendNode('#doctype');
                }
            } else if(matches = scanner.scan(/^<!--([\s\S]*?)-->/i)){
                this.appendNode('#comment', {value: matches[1]});
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^<([a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s<>]+)>/))){
                this.appendNode('markdown-link', {href: matches[1]}).appendNode('#text', {value: matches[1]});
            } else if(parseInlineMarkdown && (matches = scanner.scan(/^<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/))){
                this.appendNode('markdown-link', {href: `mailto:${matches[1]}`}).appendNode('#text', {value: matches[1]});
            } else if(matches = scanner.scan(/^<([^>\s]+)/)){
                const type = matches[1].toLowerCase().replace(/\/$/, '');
                const attributes = {};

                while(scanner.length > 0){
                    if(matches = scanner.scan(/^\s*([\w-:]+)\s*=\s*\"([^\"]*)\"/)){
                        attributes[matches[1]] = unescapeHtml(matches[2]);
                    } else if(matches = scanner.scan(/^\s*([\w-:]+)\s*=\s*\'([^\']*)\'/)){
                        attributes[matches[1]] = unescapeHtml(matches[2]);
                    } else if(matches = scanner.scan(/^\s*([\w-:]+)\s*=\s*([^\s>]+)/)){
                        attributes[matches[1]] = unescapeHtml(matches[2]);
                    } else if(matches = scanner.scan(/^\s*([\w-:]+)/)){
                        attributes[matches[1]] = null;
                    } else {
                        scanner.scan(/^[^>]*>/);
                        break;
                    }
                }

                if(matches = type.match(/^\/(.*)/)){
                    if(SELF_CLOSING_TAGS.includes(matches[1])) continue;
                    throw new CloseTag(matches[1]);
                }

                const child = this.appendNode(type, attributes);

                if(SELF_CLOSING_TAGS.includes(type)){
                    // do nothing
                } else if(TEXT_ONLY_TAGS.includes(type) && (matches = scanner.scan(new RegExp(`^([\\s\\S]*?)<\\/${type}[^>]*>`)))){
                    child.appendNode('#text', {value: matches[1]});
                } else if(TEXT_ONLY_TAGS.includes(type) && (matches = scanner.scan(/^([\s\S]+)/))){
                    child.appendNode('#text', {value: matches[1]});
                } else {
                    try {
                        child.consumeHtml(scanner, options);
                    } catch(e){
                        if(e instanceof CloseTag && e.type == type){
                            //do nothing
                        } else {
                            throw e;
                        }
                    }
                }
            } else if(matches = scanner.scan(/^[\s\S]/)) {
                this.appendNode('#text', {value: matches[0]});
            } else {
                break;
            }
        }
    },

    // Public entry point: parse a Markdown document string into markdown-* block
    // nodes, delegating each leaf block's inline content to appendHtml with the
    // parseInlineMarkdown flag. Line endings are normalised to `\n` first (per
    // CommonMark) so a stray `\r` — e.g. from a CRLF form POST — can't leave a
    // closing fence or other line-anchored marker unmatched.
    appendMarkdown(markdown){
        this.consumeMarkdown(new StringScanner(markdown.replace(/\r\n?/g, '\n')));
        return this;
    },

    // Worker: consume block-level Markdown from a live scanner. Mirrors
    // consumeHtml — append* takes the source string, consume* works a scanner.
    consumeMarkdown(scanner){
        while(scanner.length > 0){
            const lengthBefore = scanner.length;
            let matches;

            if(scanner.scan(/^[ \t]*(?:\n|$)/)){
                // blank line — separates blocks; the `$` alternative consumes a
                // whitespace-only final line with no trailing newline, which no
                // other branch matches (the paragraph collector treats it as
                // blank and stops without consuming — an infinite loop without
                // this).
            } else if(matches = scanner.scan(/^ {0,3}(#{1,6})(?:[ \t]+([^\n]*?))?[ \t]*#*[ \t]*(?:\n|$)/)){
                this.appendNode('markdown-heading', {level: `${matches[1].length}`})
                    .appendHtml(matches[2] || '', {parseInlineMarkdown: true});
            } else if(/^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}(?:\n|$)/.test(scanner.string)){
                scanner.scanLine();
                this.appendNode('markdown-thematic-break');
            } else if(matches = scanner.scan(/^ {0,3}(```+|~~~+)[ \t]*([^\n]*)(?:\n|$)/)){
                const fence = matches[1];
                const language = matches[2].trim().split(/\s+/)[0];
                const closingPattern = new RegExp('^ {0,3}' + fence[0] + '{' + fence.length + ',}[ \\t]*(?:\\n|$)');
                const lines = [];
                while(scanner.length > 0 && !closingPattern.test(scanner.string)){
                    lines.push(scanner.scanLine());
                }
                scanner.scan(closingPattern);
                this.appendNode('markdown-code-block', language ? {language} : {})
                    .appendNode('#text', {value: lines.join('\n')});
            } else if(scanner.match(/^ {0,3}>/)){
                const lines = [];
                while(scanner.length > 0){
                    if(scanner.scan(/^ {0,3}> ?/)){
                        lines.push(scanner.scanLine());
                    } else if(isLazyContinuation(scanner.string)){
                        lines.push(scanner.scanLine());
                    } else {
                        break;
                    }
                }
                this.appendNode('markdown-blockquote').appendMarkdown(lines.join('\n'));
            } else if(/^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+/.test(scanner.string)){
                const ordered = /^ {0,3}\d/.test(scanner.string);
                const list = this.appendNode('markdown-list', ordered ? {ordered: 'true'} : {});
                const markerRe = ordered
                    ? /^( {0,3}(\d{1,9})[.)][ \t]+)/
                    : /^( {0,3}[-*+][ \t]+)/;
                let loose = false;
                let firstItem = true;
                let markerMatch;
                while(scanner.length > 0 && (markerMatch = scanner.scan(markerRe))){
                    if(firstItem && ordered && markerMatch[2] !== '1'){
                        list.attributes.start = markerMatch[2];
                    }
                    firstItem = false;
                    const contentCol = markerMatch[1].length;
                    const indentStr = ' '.repeat(contentCol);
                    const itemLines = [scanner.scanLine()];
                    while(scanner.length > 0){
                        const blank = scanner.string.match(/^([ \t]*)(?:\n|$)/);
                        if(blank){
                            const afterBlank = scanner.string.slice(blank[0].length);
                            if(afterBlank.startsWith(indentStr) && !/^[ \t]*(?:\n|$)/.test(afterBlank)){
                                scanner.scan(/^[ \t]*\n/);
                                itemLines.push('');
                                loose = true;
                            } else if(/^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+/.test(afterBlank)){
                                scanner.scan(/^[ \t]*\n/);
                                loose = true;
                                break;
                            } else {
                                break;
                            }
                        } else if(scanner.string.startsWith(indentStr)){
                            itemLines.push(scanner.scanLine().slice(contentCol));
                        } else {
                            break;
                        }
                    }
                    list.appendNode('markdown-list-item').appendMarkdown(itemLines.join('\n'));
                }
                if(!loose){
                    list.children.forEach(item => {
                        const flattened = [];
                        item.children.forEach(child => {
                            if(child.type == 'markdown-paragraph'){
                                child.children.forEach(c => {
                                    c.parent = item;
                                    flattened.push(c);
                                });
                            } else {
                                flattened.push(child);
                            }
                        });
                        item.children = flattened;
                    });
                }
            } else if(/^( {4}|\t)/.test(scanner.string)){
                // CommonMark indented code block: a line beginning with 4
                // spaces or one tab at block start. Gathers consecutive
                // indented lines and interior blank lines, strips the
                // 4-space / tab indent, trims trailing blank lines. The
                // rule is intentionally absent from startsBlock — indented
                // code cannot interrupt a paragraph.
                const lines = [];
                while(scanner.length > 0){
                    if(/^( {4}|\t)/.test(scanner.string)){
                        lines.push(scanner.scanLine().replace(/^( {4}|\t)/, ''));
                    } else if(/^[ \t]*\n/.test(scanner.string)){
                        const after = scanner.string.replace(/^(?:[ \t]*\n)+/, '');
                        if(/^( {4}|\t)/.test(after)){
                            scanner.scan(/^[ \t]*\n/);
                            lines.push('');
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                while(lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
                this.appendNode('markdown-code-block')
                    .appendNode('#text', {value: lines.join('\n') + '\n'});
            } else if(matches = matchTableHead(scanner)){
                // GFM pipe table: only committed when line 1 has a `|` and
                // line 2 is a valid delimiter row with matching cell count.
                scanner.scanLine(); // header
                scanner.scanLine(); // delimiter
                const { headerCells, alignments } = matches;
                const table = this.appendNode('markdown-table');
                const headRow = table.appendNode('markdown-table-head').appendNode('markdown-table-row');
                headerCells.forEach((cell, i) => {
                    const attributes = alignments[i] ? {align: alignments[i]} : {};
                    headRow.appendNode('markdown-table-header', attributes)
                        .appendHtml(cell, {parseInlineMarkdown: true});
                });
                const bodyRows = [];
                while(scanner.length > 0){
                    const firstLine = scanner.matchLine();
                    if(!firstLine.trim() || !firstLine.includes('|')) break;
                    bodyRows.push(splitTableRow(scanner.scanLine()));
                }
                if(bodyRows.length > 0){
                    const tableBody = table.appendNode('markdown-table-body');
                    bodyRows.forEach(cells => {
                        const row = tableBody.appendNode('markdown-table-row');
                        for(let i = 0; i < headerCells.length; i++){
                            const attributes = alignments[i] ? {align: alignments[i]} : {};
                            row.appendNode('markdown-table-cell', attributes)
                                .appendHtml(cells[i] || '', {parseInlineMarkdown: true});
                        }
                    });
                }
            } else if(HTML_BLOCK_OPEN.test(scanner.string)){
                // Top-level raw HTML block: gather lines until a blank line and
                // hand them to appendHtml, which builds them straight into this
                // block container — so the HTML is emitted unwrapped (no <p>).
                // Content is parsed as plain HTML (no parseInlineMarkdown), so
                // Markdown inside a block stays literal, per CommonMark.
                const lines = [];
                while(scanner.length > 0 && !/^[ \t]*\n/.test(scanner.string)){
                    lines.push(scanner.scanLine());
                }
                this.appendHtml(lines.join('\n'));
            } else {
                const lineNumber = scanner.line;
                const lines = [];
                let setextLevel = null;
                while(scanner.length > 0){
                    // Setext heading: an underline after at least one collected
                    // paragraph line takes precedence over startsBlock's
                    // thematic-break reclassification of `-----` — checked here,
                    // inside the collector, before the outer loop re-enters and
                    // sees `-----` as a fresh thematic break.
                    if(lines.length > 0){
                        if(scanner.scan(/^ {0,3}=+[ \t]*(?:\n|$)/)){
                            setextLevel = 1;
                            break;
                        }
                        if(scanner.scan(/^ {0,3}-+[ \t]*(?:\n|$)/)){
                            setextLevel = 2;
                            break;
                        }
                    }
                    if(startsBlock(scanner.string)) break;
                    lines.push(scanner.scanLine());
                }
                const text = lines.join('\n').trim();
                let slashMatch;
                if(setextLevel !== null){
                    this.appendNode('markdown-heading', {level: `${setextLevel}`})
                        .appendHtml(text, {parseInlineMarkdown: true});
                } else if(!this.parent && lines.length === 1 && (slashMatch = text.match(/^\/([^\/\s]*)(.*)$/))){
                    this.appendNode('markdown-slash-block', {
                        line: `${lineNumber}`,
                        name: slashMatch[1],
                        args: slashMatch[2].trim()
                    }).appendNode('#text', {value: text});
                } else if(text){
                    this.appendNode('markdown-paragraph').appendHtml(text, {parseInlineMarkdown: true});
                }
            }

            if(scanner.length == lengthBefore){
                // No branch consumed input — a block-classification bug (a
                // startsBlock clause without a consuming branch above, which
                // would otherwise loop forever). Consume the line as a
                // paragraph so parsing always makes progress, mirroring
                // consumeHtml's one-char literal-text fallback.
                const text = scanner.scanLine().trim();
                if(text) this.appendNode('markdown-paragraph').appendHtml(text, {parseInlineMarkdown: true});
            }
        }
    },

    hasOpenEmphasis(type, marker){
        let node = this;
        while(node){
            if(node.type == type && node.marker == marker) return true;
            node = node.parent;
        }
        return false;
    },

    appendEmphasis(types, marker, scanner, options){
        const child = this.appendNode(types[0]);
        child.marker = marker;
        try {
            if(types.length > 1){
                child.appendEmphasis(types.slice(1), marker, scanner, options);
            } else {
                child.consumeHtml(scanner, options);
            }
        } catch(e){
            if(e instanceof CloseTag && e.type == types[0]){
                // closed by a matching delimiter
            } else {
                throw e;
            }
        }
    },

    // Lower the markdown-* dialect to HTML, in place. Idempotent: non-markdown
    // nodes pass through, so a second call is a no-op. Fires the beforeRender
    // hook on the markdown-* tree and afterRender on the lowered HTML tree.
    async render(){
        await this.runHook('beforeRender');
        const htmlTagFor = {
            'markdown-em': 'em',
            'markdown-strong': 'strong',
            'markdown-strikethrough': 's',
            'markdown-code': 'code',
            'markdown-link': 'a',
            'markdown-image': 'img',
            'markdown-paragraph': 'p',
            'markdown-list-item': 'li',
            'markdown-blockquote': 'blockquote',
            'markdown-thematic-break': 'hr',
            'markdown-hard-break': 'br',
            'markdown-table': 'table',
            'markdown-table-head': 'thead',
            'markdown-table-body': 'tbody',
            'markdown-table-row': 'tr'
        };
        this.traverse(node => {
            // Each branch lowers a markdown-* node we vouch for, so mark it safe
            // for sanitize(). Raw HTML and text nodes fall through unmarked.
            let lowered = true;
            if(node.type == 'markdown-heading'){
                const level = Math.min(6, Math.max(1, parseInt(node.attributes.level, 10) || 1));
                node.type = `h${level}`;
                delete node.attributes.level;
            } else if(node.type == 'markdown-list'){
                node.type = node.attributes.ordered ? 'ol' : 'ul';
                delete node.attributes.ordered;
            } else if(node.type == 'markdown-code-block'){
                node.type = 'pre';
                const codeAttrs = node.attributes.language
                    ? {class: `language-${node.attributes.language}`}
                    : {};
                delete node.attributes.language;
                const code = new node.constructor(node, 'code', codeAttrs);
                code.children = node.children;
                code.children.forEach(child => child.parent = code);
                code.safe = true;
                node.children = [code];
            } else if(node.type == 'markdown-slash-block'){
                node.type = 'p';
                node.attributes = {'data-line-number': node.attributes.line};
            } else if(node.type == 'markdown-table-header' || node.type == 'markdown-table-cell'){
                if(node.attributes.align){
                    node.attributes.style = `text-align:${node.attributes.align}`;
                    delete node.attributes.align;
                }
                node.type = node.type == 'markdown-table-header' ? 'th' : 'td';
            } else if(htmlTagFor[node.type]){
                node.type = htmlTagFor[node.type];
            } else {
                lowered = false;
            }
            if(lowered) node.safe = true;
        });
        await this.runHook('afterRender');
        return this;
    },

    traverse(fn){
        fn.call(this, this);
        this.children.forEach(child => child.traverse(fn));
    },

    // Restrict markup to what render() vouched for. Trusted nodes (safe, plus
    // structural #text/#fragment) are kept and recursed into; everything else
    // (raw HTML) is re-emitted as escaped literal text, so it displays inertly.
    sanitize(){
        const STRUCTURAL = ['#text', '#fragment'];
        this.children = this.children.flatMap(child => {
            if(child.safe || STRUCTURAL.includes(child.type)){
                child.sanitize();
                child.scrubUrl();
                return [child];
            }
            return [new this.constructor(this, '#text', {value: child.toString()})];
        });
        return this;
    },

    // Drop href/src carrying a dangerous URL scheme, even on safe nodes:
    // markdown can still produce e.g. [x](javascript:...). The scheme (text
    // before the first ':') is reduced to its letters before the check, so
    // whitespace/control chars browsers ignore can't smuggle a scheme past it
    // (e.g. a tab inside a `<...>` destination, which parsing preserves).
    scrubUrl(){
        ['href', 'src'].forEach(name => {
            const value = this.attributes[name];
            const scheme = (value || '').split(':')[0].replace(/[^a-z]/gi, '').toLowerCase();
            if(['javascript', 'data', 'vbscript'].includes(scheme)){
                delete this.attributes[name];
            }
        });
    },

    toJSON(){
        return {
            type: this.type,
            attributes: this.attributes,
            safe: this.safe,
            children: this.children.map(child => child.toJSON())
        };
    },

    serialize(){
        return JSON.stringify(this);
    },

    toString(){
        if(this.type == '#doctype') return '<!DOCTYPE html>';
        if(this.type == '#text'){
            if(this.parent && TEXT_ONLY_TAGS.includes(this.parent.type)) return this.attributes.value;
            return escapeHtml(this.attributes.value);
        }
        if(this.type == '#comment') return `<!--${escapeHtml(this.attributes.value)}-->`;
        const out = [];
        if(this.type != '#fragment'){
            out.push(`<${this.type}`);
            Object.keys(this.attributes).forEach(name => {
                const value = this.attributes[name];
                if(value){
                    out.push(` ${name}="${escapeHtml(value)}"`);
                } else {
                    out.push(` ${name}`);
                }
            })
            out.push('>');
        }
        this.children.forEach(child => {
            out.push(child.toString());
        });
        if(this.type != '#fragment' && !SELF_CLOSING_TAGS.includes(this.type)) out.push(`</${this.type}>`);
        return out.join('');
    }
});

export const parseHtml = html => MarkupNode.fromHtml(html);

export const parseMarkdown = markdown => MarkupNode.fromMarkdown(markdown);

export const renderMarkdown = (markdown, options) => MarkupNode.renderMarkdown(markdown, options);
