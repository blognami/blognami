
import { View } from '../../view.js';

export default ({ renderHtml, params: { _path } }) => {
    const name = _path.replace(/\/blocks\//, '');
    const prefix = _path.replace(/^\/blocks\//, '');

    const names = Object
        .keys(View.classes)
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
