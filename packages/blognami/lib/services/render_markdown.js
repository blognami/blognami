
import { defineService } from 'pinstripe';
import MarkdownIt from 'markdown-it';

defineService('renderMarkdown', ({ renderHtml }) => {
    return markdown => renderHtml(new MarkdownIt().render(markdown || ''));
});
