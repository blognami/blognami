
import MarkdownIt from 'markdown-it';

export default ({ renderHtml }) => {
    return markdown => renderHtml(new MarkdownIt().render(markdown || ''));
};
