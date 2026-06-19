export default {
    render(){
        const { url, target, label, testId, preload, dataConfirm, placeholder } = this.params;

        return this.renderTag('a', {
            href: url,
            target: target,
            'data-test-id': testId,
            'data-preload': preload ? 'true' : null,
            'data-confirm': dataConfirm || null,
            'data-placeholder': placeholder || null,
            body: label
        });
    }
};