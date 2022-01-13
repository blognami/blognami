
import { Url } from '../url.js';

export default {
    decorate(nodeWrapper){
        if(nodeWrapper.type == '#document' || nodeWrapper.is('.frame, .overlay')) this.decorateFrame(nodeWrapper);
        if(nodeWrapper.type == '#document') this.decorateDocument(nodeWrapper);
        if(nodeWrapper.is('.overlay')) this.decorateOverlay(nodeWrapper);
        if(nodeWrapper.is('.progress-bar')) this.decorateProgressBar(nodeWrapper);
        if(nodeWrapper.is('.markdown-editor')) this.decorateMarkdownEditor(nodeWrapper);
        if(nodeWrapper.is('a, [data-acts-as="a"]')) this.decorateAnchor(nodeWrapper);
        if(nodeWrapper.is('form, [data-acts-as="form"]')) this.decorateForm(nodeWrapper);
        this.decorateNode(nodeWrapper);
    },

    decorateFrame(nodeWrapper){
        nodeWrapper.assignProps({
            isFrame: true,

            get url(){
                if(this._url === undefined){
                    this._url = Url.fromString(
                        this.attributes['data-url'] || window.location,
                        this.frame ? this.frame.url : window.location
                    );
                }
                return this._url;
            },
        
            set url(url){
                this._url = Url.fromString(
                    url,
                    this.url
                );
            },
        
            load(arg1 = {}){
                const { progressBar } = this.document;
                
                let { _method = 'GET', _url = this.url.toString(), _headers = {}, ...params } = arg1;
        
                _headers = { ..._headers };
                _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'basic';
        
                this.abort();
        
                _method = _method.toUpperCase();
                
                this.url = _url;
                const isRequestBody = _method == 'POST' || _method == 'PUT' || _method == 'PATCH';
                if(!isRequestBody){
                    this.url.params = {...this.url.params, ...params};
                }
        
                this._request = new XMLHttpRequest();
        
                this._request.open(_method, this.url.toString(), true);
        
                Object.keys(_headers).forEach(name => {
                    this._request.setRequestHeader(name, _headers[name]);
                });
        
                progressBar.start();
        
                this._request.onload = () => {
                    if (this._request.status >= 200 && this._request.status < 500) {
                        this.patch(this._request.response);
                        this.abort();
                    }
                }
        
                this._request.onerror = () => this.abort();
        
                const formData = new FormData();
                if(isRequestBody){
                    Object.keys(params).forEach((name) => formData.append(name, params[name]));
                }
                
                this._request.send(formData);
            },
        
            abort(){
                const progressBar = (this.document || this).progressBar;
                if(this._request){
                    this._request.abort();
                    delete this._request;
                    progressBar.stop();
                }
            }
        })
    },

    decorateDocument(nodeWrapper){
        const { load } = nodeWrapper;

        window.onpopstate = (event) => {
            nodeWrapper.load({ _url: event.state || window.location }, true);
        };
        window._nodeWrapper = this;

        nodeWrapper.assignProps({
            isDocument: true,

            get progressBar(){
                if(!this._progressBar){
                    this._progressBar = this.descendants.find(node => node.is('.progress-bar'));
                }
                return this._progressBar;
            },
        
            load(_params = {}, replace = false){
                const previousUrl = this.url.toString();
                
                let { _headers = {}, ...params } = _params;
                _headers = { ..._headers };
                _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'document';
                params._headers = _headers;
        
                load.call(this, params);
                if(params._method == 'GET' && previousUrl != this.url.toString()){
                    if(replace){
                        history.replaceState(this.url.toString(), null, this.url.toString());
                    } else {
                        history.pushState(this.url.toString(), null, this.url.toString());
                        window.scrollTo(0, 0);
                    }
                }
            }
        })
    },

    decorateOverlay(nodeWrapper){
        const { load, remove } = nodeWrapper;

        nodeWrapper.assignProps({
            load(_params = {}){
                let { _headers = {}, ...params } = _params;
                _headers = { ..._headers };
                _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'overlay';
                params._headers = _headers;
        
                load.call(this, params);
            },
        
            remove(...args){
                remove.call(this, ...args);
                if(!this.document.descendants.find(node => node.is('body')).children.filter((child) => child.is('.overlay')).length){
                    this.document.descendants.filter(node => node.is('html')).forEach(node => {
                        node.removeClass('has-overlay');
                    })
                }
            }
        });
    },

    decorateProgressBar(nodeWrapper){
        nodeWrapper.patch('');

        nodeWrapper.assignProps({
            width: 0,

            startCount: 0,

            start(){
                if(this.startCount == 0){
                    this._delayTimeout = this.setTimeout(() => {
                        this.patch('');
                        this.patch('<div></div>');
                        this._animationInterval = this.setInterval(() => {
                            const child = this.children.pop();
                            if(child){
                                this.width = this.width + (Math.random() / 100);
                                child.node.style.width = `${10 + (this.width * 90)}%`;
                            }
                        }, 300);
                    }, 300);
                }
                this.startCount++;
            },
        
            stop(){
                this.startCount--;
                if(this.startCount == 0){
                    clearTimeout(this._delayTimeout);
                    clearInterval(this._animationInterval);
                    this.width = 0;
                    const child = this.children.pop();
                    if(child){
                        child.node.style.width = '100%';
                        child.node.style.opacity = 0;
                    }
                }
            }
        });
    },

    decorateMarkdownEditor(nodeWrapper){
        const anchorTextarea = nodeWrapper.frame.parent;
        const editorTextarea = nodeWrapper.descendants.find(n => n.is('textarea'));

        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;
        
        const previewFrame = nodeWrapper.frame.descendants.find(n => n.is('.markdown-editor-preview-pane'));

        nodeWrapper.on('submit', () => {
            const { value } = nodeWrapper.values;
            previewFrame.load({ _method: 'post', value });
            anchorTextarea.value = value
        });
    },

    decorateAnchor(nodeWrapper){
        const { ignoreEventsFromChildren = false } = nodeWrapper.data;
        nodeWrapper.on('click', (event) => {
            if(ignoreEventsFromChildren && event.target != nodeWrapper) return;
            event.preventDefault();
            event.stopPropagation();
            const { action = 'load', confirm, target = '_self', method = 'GET', href } = { ...nodeWrapper.attributes, ...nodeWrapper.data };
            if(action == 'load') loadFrame.call(nodeWrapper, confirm, target, method, href);
            if(action == 'remove') removeFrame.call(nodeWrapper, confirm, target);
        });
    },

    decorateForm(nodeWrapper){
        nodeWrapper.on('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const { confirm, target = '_self', method = 'GET', action } = { ...nodeWrapper.attributes, ...nodeWrapper.data };
            loadFrame.call(nodeWrapper, confirm, target, method, action);
        });
    },

    decorateNode(nodeWrapper){
        const { autosubmit, trigger } = nodeWrapper.data;

        if(autosubmit){
            let hash = JSON.stringify(this.values);
            nodeWrapper.setInterval(() => {
                const newHash = JSON.stringify(nodeWrapper.values);
                if(hash != newHash){
                    hash = newHash;
                    nodeWrapper.trigger('submit');
                }
            }, 100);
        }

        if(trigger){
            nodeWrapper.setTimeout(() => {
                nodeWrapper.trigger(trigger);
            }, 0);
        }
    }
};

function loadFrame(confirm, target, method, url){
    if(confirm && !window.confirm(confirm)){
        return;
    }

    let frame;
    
    if(target == '_overlay'){
        this.document.descendants.filter(node => node.is('html')).forEach(node => {
            node.addClass('has-overlay');
        });
        frame = this.document.descendants.find(node => node.is('body')).append(`<div class="overlay"></div>`).pop();
        frame._parent = this;
    } else {
        frame = getFrame.call(this, target);
        if(!frame) return;
    }

    url = Url.fromString(url || frame.url, this.frame.url);
    if(url.host != frame.url.host || url.port != frame.url.port){
        return;
    }

    frame.load({ ...this.values, _method: method, _url: url });
}

function removeFrame(confirm, target){
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