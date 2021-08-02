
import { defineView } from 'pinstripe';

defineView('index', ({ renderHtml, params: { posts, pagination } }) => renderHtml`
    ${posts.map(({ slug, title, body }) => renderHtml`
        <div class="card mb-4">
            <header class="card-header">
                <a class="card-header-title" href="/${slug}">
                    ${title}
                </a>
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


