
export const styles = `
    .root { display: none; }
`;

export const decorators = {
    root(){
        const { event, ...params } = JSON.parse(this.attributes['data-params'] ?? '{}');
        if (typeof gtag !== 'undefined' && event) {
            gtag('event', event, { ...params, transport_type: 'beacon' });
        }
    }
};

export default {
    render(){
        return this.renderTag({
            class: this.cssClasses.root,
            ['data-params']: JSON.stringify(this.params)
        });
    }
};
