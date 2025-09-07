
export const theme = {
    colors: {
        primaryBackground: '@colors.lime.500',
        primaryHoverBackground: '@colors.lime.600',
        dangerBackground: '@colors.red.600',
        dangerHoverBackground: '@colors.red.700',
        primaryText: '@colors.white',
        dangerText: '@colors.white',
        focusRing: '@colors.blue.500',
    }
};

export const styles = ({ views, colors }) =>`
    .root {
        /* Reset & Layout */
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        
        /* Typography */
        font-family: inherit;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        text-decoration: none;
        white-space: nowrap;
        
        /* Spacing */
        height: 4rem;
        padding: 0 1.6rem;
        
        /* Colors */
        background-color: ${colors.white};
        border: 0.1rem solid ${colors.gray[300]};
        color: ${colors.gray[700]};
        
        /* Border & Shape */
        border-radius: 0.6rem;
        
        /* Interaction */
        cursor: pointer;
        user-select: none;
        
        /* Animation */
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        
        /* Shadow */
        box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.05);
    }
    
    .root:hover {
        border-color: ${colors.gray[400]};
        box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
        transform: translateY(-0.05rem);
    }
    
    .root:focus {
        outline: none;
        border-color: ${views['_pinstripe/_button'].colors.focusRing};
        box-shadow: 0 0 0 0.3rem rgba(59, 130, 246, 0.15);
    }
    
    .root:active {
        transform: translateY(0);
        box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.05);
    }
    
    .root:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }
    
    .root:not(:last-child) {
        margin-right: 0.8rem;
    }
    
    .root.is-primary {
        background-color: ${views['_pinstripe/_button'].colors.primaryBackground};
        border-color: ${views['_pinstripe/_button'].colors.primaryBackground};
        color: ${views['_pinstripe/_button'].colors.primaryText};
        box-shadow: 0 0.2rem 0.4rem rgba(72, 199, 142, 0.2);
    }
    
    .root.is-primary:hover {
        background-color: ${views['_pinstripe/_button'].colors.primaryHoverBackground};
        border-color: ${views['_pinstripe/_button'].colors.primaryHoverBackground};
        box-shadow: 0 0.4rem 0.8rem rgba(72, 199, 142, 0.3);
    }
    
    .root.is-dangerous {
        background-color: ${views['_pinstripe/_button'].colors.dangerBackground};
        border-color: ${views['_pinstripe/_button'].colors.dangerBackground};
        color: ${views['_pinstripe/_button'].colors.dangerText};
        box-shadow: 0 0.2rem 0.4rem rgba(220, 38, 38, 0.2);
    }
    
    .root.is-dangerous:hover {
        background-color: ${views['_pinstripe/_button'].colors.dangerHoverBackground};
        border-color: ${views['_pinstripe/_button'].colors.dangerHoverBackground};
        box-shadow: 0 0.4rem 0.8rem rgba(220, 38, 38, 0.3);
    }
    
    .root.is-full-width {
        width: 100%;
    }
    
    .root.is-small {
        font-size: 1.2rem;
        height: 3.2rem;
        padding: 0 1.2rem;
    }
    
    .root.is-large {
        font-size: 1.6rem;
        height: 4.8rem;
        padding: 0 2.4rem;
    }
`;

export default {
    render(){
        let { tagName = 'button', isPrimary, isDangerous, isFullWidth, size = 'medium', ...attributes } = this.params;

        tagName = tagName.toLowerCase();
        
        if(tagName === 'button'){
            attributes.type ??= 'button';
            if(attributes.type == 'submit') isPrimary ??= true;
        }

        const classes = [this.cssClasses.root];

        // Size classes
        if(size === 'small') classes.push(this.cssClasses.isSmall);
        if(size === 'large') classes.push(this.cssClasses.isLarge);

        // Variant classes
        if(isPrimary) classes.push(this.cssClasses.isPrimary);
        if(isDangerous) classes.push(this.cssClasses.isDangerous);
        
        // Layout classes
        if(isFullWidth) classes.push(this.cssClasses.isFullWidth);
        
        return this.renderTag(tagName, { ...attributes, class: classes.join(' ') });
    }
};
