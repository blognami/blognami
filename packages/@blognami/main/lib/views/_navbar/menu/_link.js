export default {
    render(){
        const { url, target, label, testId, preload  } = this.params;
        
        return this.renderTag('a', {
            href: url,
            target: target,
            'data-test-id': testId,
            'data-preload': preload ? 'true' : null,
            body: label
        });
    }
};