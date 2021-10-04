
import { defineView } from 'pinstripe';

defineView('index', ({ renderHtml, params: { posts, pagination, isSignedIn } }) => renderHtml`
    ${posts.map(({ slug, title, id, body }) => renderHtml`
        <div class="card mb-4">
            <header class="card-header">
                <a class="card-header-title" href="/${slug}">
                    ${title}
                </a>
                ${() => {
                    if(isSignedIn){
                        return renderHtml`
                            <a
                                class="delete"
                                style="margin: 7px;"
                                href="/delete_post?id=${id}"
                                target="_overlay"
                                data-confirm="Are you really sure you want to delete this post?"
                            ></a>
                        `;
                    }
                }}
            </header>
            <div class="card-content">
                <div class="content">
                    ${body}
                </div>
            </div>
        </div>
    `)}
    <nav class="pagination">
        <ul class="pagination-list mb-4">
            ${pagination.map(({ number, current }) => renderHtml`
                <li>
                    <a class="pagination-link${current ? ' is-current' : ''}" href="?page=${number}">${number}</a>
                </li>
            `)}
        </ul>
    </nav>
`);


