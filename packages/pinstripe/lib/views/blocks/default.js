
export default ({ renderHtml, viewNames, params }) => {
    const path = params._url.path
    const name = path.replace(/\/blocks\//, '');
    const prefix = path.replace(/^\/blocks\//, '');

    const names = viewNames
        .filter(name => name.match(/^blocks\/.+/) && name != 'blocks/default')
        .map(name => name.replace(/^blocks\//, ''))
        .filter(name => name.startsWith(prefix))
        .sort()

    return renderHtml`
        <div class="default-block">
            <p>Insert block:</p>
            <ul>
                ${names.map(name => renderHtml`
                    <li data-node-wrapper="markdown-editor/line-inserter" data-line-content="/${name}">${name}</li>
                `)}
            </ul>
        </div>
    `;
};
