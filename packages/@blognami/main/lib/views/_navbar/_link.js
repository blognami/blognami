

export const styles = `
    .root {
        position: relative;
        padding: 0.375rem 1rem 0.375rem 0;
        white-space: nowrap;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
    }

    .root[data-active="true"] {
        background-color: #f9f9f9;
    }
`;

export default {
    render(){
        return this.renderTag('a', {
            class: this.cssClasses.root,
            ...this.params
        });
    }
};
