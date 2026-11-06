import { MarkupNode } from '@blognami/utils';

export const titleFromMarkdown = async (body) => {
    const node = await MarkupNode.fromMarkdown(body);
    let title;
    node.traverse(child => {
        if(title === undefined && child.type == 'markdown-heading' && child.attributes.level == '1'){
            title = child.text.trim();
        }
    });
    return title;
};
