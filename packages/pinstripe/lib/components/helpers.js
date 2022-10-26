
export function loadFrame(confirm, target, method, url){
    if(confirm && !window.confirm(confirm)){
        return;
    }

    let frame;
    
    if(target == '_overlay'){
        this.document.body.clip();
        frame = this.document.descendants.find(node => node.is('body')).append(`<pinstripe-overlay load-on-init="false"></pinstripe-overlay>`).pop();
        frame._parent = this;
        this._overlayChild = frame;
    } else {
        frame = getFrame.call(this, target);
        if(!frame) return;
    }

    url = new URL(url || frame.url, this.frame.url);
    if(url.protocol != 'data:' && (url.host != frame.url.host || url.port != frame.url.port)){
        return;
    }

    if(method.match(/POST|PUT|PATCH/i)){
        const formData = new FormData();
        const values = this.values;
        Object.keys(values).forEach((name) => formData.append(name, values[name]));
        frame.load(url, { method, body: formData });
    } else {
        frame.load(url, { method });
    }    
}

export function removeFrame(confirm, target){
    if(confirm && !window.confirm(confirm)){
        return;
    }

    const frame = getFrame.call(this, target);
    if(frame) frame.remove();
}

function getFrame(target){
    if(target == '_self') return this.frame;
    if(target == '_top') return this.document;
    if(target.match(/^_parent/)){
        const index = target.split(/_/).length - 1;
        return this.parents.filter(n => n.isFrame)[index];
    }
    return this.frame.decendants.find(n => n.isFrame && n.data.name == target);
}
