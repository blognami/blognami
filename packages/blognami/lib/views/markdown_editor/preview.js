
export default ({ renderMarkdown, params }) => {
    const { value = '' } = params;

    return renderMarkdown(value);
};
