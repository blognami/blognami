
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

export const styles = ({ views, colors, shadow, remify }) =>`
    .root {
        /* Reset & Layout */
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;

        /* Typography */
        font-family: inherit;
        font-size: ${remify(14)};
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        text-decoration: none;
        white-space: nowrap;

        /* Spacing */
        height: ${remify(40)};
        padding: 0 ${remify(16)};

        /* Colors */
        background-color: ${colors.white};
        border: ${remify(1)} solid ${colors.gray[300]};
        color: ${colors.gray[700]};

        /* Border & Shape */
        border-radius: ${remify(6)};

        /* Interaction */
        cursor: pointer;
        user-select: none;

        /* Animation */
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        /* Shadow */
        box-shadow: ${shadow['2xs']};
    }

    .root:hover {
        border-color: ${colors.gray[400]};
        box-shadow: ${shadow.xs};
        transform: translateY(-${remify(0.5)});
    }

    .root:focus {
        outline: none;
        border-color: ${views['_pinstripe/_button'].colors.focusRing};
        box-shadow: 0 0 0 ${remify(3)} color-mix(in oklch, ${views['_pinstripe/_button'].colors.focusRing} 15%, transparent);
    }

    .root:active {
        transform: translateY(0);
        box-shadow: ${shadow['2xs']};
    }

    .root:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    .root:not(:last-child) {
        margin-right: ${remify(8)};
    }

    .root.is-primary {
        background-color: ${views['_pinstripe/_button'].colors.primaryBackground};
        border-color: ${views['_pinstripe/_button'].colors.primaryBackground};
        color: ${views['_pinstripe/_button'].colors.primaryText};
        box-shadow: 0 ${remify(2)} ${remify(4)} color-mix(in oklch, ${views['_pinstripe/_button'].colors.primaryBackground} 20%, transparent);
    }

    .root.is-primary:hover {
        background-color: ${views['_pinstripe/_button'].colors.primaryHoverBackground};
        border-color: ${views['_pinstripe/_button'].colors.primaryHoverBackground};
        box-shadow: 0 ${remify(4)} ${remify(8)} color-mix(in oklch, ${views['_pinstripe/_button'].colors.primaryBackground} 30%, transparent);
    }

    .root.is-dangerous {
        background-color: ${views['_pinstripe/_button'].colors.dangerBackground};
        border-color: ${views['_pinstripe/_button'].colors.dangerBackground};
        color: ${views['_pinstripe/_button'].colors.dangerText};
        box-shadow: 0 ${remify(2)} ${remify(4)} color-mix(in oklch, ${views['_pinstripe/_button'].colors.dangerBackground} 20%, transparent);
    }

    .root.is-dangerous:hover {
        background-color: ${views['_pinstripe/_button'].colors.dangerHoverBackground};
        border-color: ${views['_pinstripe/_button'].colors.dangerHoverBackground};
        box-shadow: 0 ${remify(4)} ${remify(8)} color-mix(in oklch, ${views['_pinstripe/_button'].colors.dangerBackground} 30%, transparent);
    }

    .root.is-full-width {
        width: 100%;
    }

    .root.is-small {
        font-size: ${remify(12)};
        height: ${remify(32)};
        padding: 0 ${remify(12)};
    }

    .root.is-large {
        font-size: ${remify(16)};
        height: ${remify(48)};
        padding: 0 ${remify(24)};
    }
`;

export default {
    render(){
        let { tagName = 'button', isPrimary, isDangerous, isFullWidth, size = 'medium', class: _class, ...attributes } = this.params;

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

        if(_class) classes.push(_class);
        
        return this.renderTag(tagName, { ...attributes, class: classes.join(' ') });
    }
};
