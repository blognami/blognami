
export default ({ renderHtml, renderMarkdown, params: { pageable, isSignedIn }}) => renderHtml`
    <div class="content">
        <h1 class="title">${pageable.title}</h1>
        ${renderMarkdown(pageable.body)}
    </div>
    ${() => {
        if(isSignedIn){
            return renderHtml`
                <div>
                    <a class="button is-primary" href="/admin/edit_post_body?id=${pageable.id}" target="_overlay">
                        <strong>Edit</strong>
                    </a>
                </div>
            `;
        }
    }}
`;
