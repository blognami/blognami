
import { defineView } from 'pinstripe';

defineView('pageables/post', ({ renderHtml, renderMarkdown, params: { pageable, isSignedIn }}) => renderHtml`
    <div class="content">
        <h1 class="title">${pageable.title}</h1>
        ${renderMarkdown(pageable.body)}
    </div>
    ${(() => {
        if(isSignedIn){
            return renderHtml`
                <div>
                    <a class="button is-primary" href="/edit_post?id=${pageable.id}" target="_modal">
                        <strong>Edit</strong>
                    </a>
                </div>
            `;
        }
    })()}
`);
