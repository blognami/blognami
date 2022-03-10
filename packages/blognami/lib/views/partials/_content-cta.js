export default ({ renderHtml }) => renderHtml`
    {{{html}}}

    <section class="bn-cta">
        {{#has visibility="paid"}}
            <h4 class="bn-cta-title">This post is for paying subscribers only</h4>
        {{/has}}
        {{#has visibility="members"}}
            <h4 class="bn-cta-title">This post is for subscribers only</h4>
        {{/has}}
        {{#has visibility="filter"}}
            <h4 class="bn-cta-title">This post is for subscribers on the {{products}} only</h4>
        {{/has}}

        <div class="bn-cta-actions">
            {{#if @member}}
                <button class="bn-btn bn-primary-btn" href="/upgrade_account">Upgrade now</button>
            {{else}}
                <button class="bn-btn bn-primary-btn" href="/sign_up">Subscribe now</button>
                <span class="bn-cta-link" href="/sign_in">Already have an account? Sign in.</span>
            {{/if}}
        </div>
    </section>
`;