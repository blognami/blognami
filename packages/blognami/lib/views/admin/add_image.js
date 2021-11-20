
export default ({ renderForm, images, renderHtml }) => renderForm(images, {
    fields: [{ name: 'file', type: 'file' }],

    success(image){
        return renderHtml`
            <script type="pinstripe">
                ${renderHtml(`
                    const slug = ${JSON.stringify(image.slug)};
                    const title = ${JSON.stringify(image.title)};
                    const textarea = this.frame.frame.frame.descendants.find(el => el.is('textarea'));
                    const node = textarea.node;
                    node.focus();
                    const startPos = node.selectionStart;
                    const endPos = node.selectionEnd;
                    const leftText = node.value.substring(0, startPos);
                    const rightText = node.value.substring(endPos, node.value.length)
                    node.value = leftText + '![' + title + '](/' + slug + ')' + rightText;
                    this.frame.frame.remove();
                    this.frame.remove();
                `)}
            </script>
        `;
    }
});
