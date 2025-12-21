---
menu:
    path: ["Services", "featureFlags"]
---
# featureFlags

Toggle features based on configuration or HTTP headers.

## Interface

```javascript
const flags = await this.featureFlags;
// { betaFeatures: true, newUI: false, ... }
```

### Returns

- Object with feature names as keys and boolean values

## Description

The `featureFlags` service manages feature toggles via configuration or HTTP headers. Views can require specific features using `this.featureFor()` in their `meta()` method, making them available only when those flags are enabled.

## Configuration

```javascript
// pinstripe.config.js
export default {
    // Static flags
    featureFlags: {
        newDashboard: true,
        betaUI: process.env.NODE_ENV === 'development'
    },

    // Dynamic flags (function)
    featureFlags() {
        const headers = this.initialParams._headers;
        return {
            betaFeatures: headers['x-beta-user'] === 'true'
        };
    }
};
```

## HTTP Header

Enable flags via the `x-feature-flags` header:

```bash
curl -H "x-feature-flags: betaUI newDashboard" https://example.com/
```

## Examples

### Basic Usage

```javascript
export default {
    async render() {
        const flags = await this.featureFlags;

        if (flags.betaFeatures) {
            return this.renderView('beta-dashboard');
        }

        return this.renderView('standard-dashboard');
    }
}
```

### View Feature Requirements

```javascript
// This view only available when advancedSearch flag is true
export default {
    meta() {
        this.featureFor('advancedSearch');
    },

    render() {
        return this.renderHtml`<div class="advanced-search">...</div>`;
    }
}
```

### Conditional Service

```javascript
export default {
    create() {
        return this.defer(async () => {
            const flags = await this.featureFlags;

            if (flags.enhancedAnalytics) {
                return this.createEnhancedAnalytics();
            }
            return this.createBasicAnalytics();
        });
    }
}
```

## Notes

- Flags cached for request duration
- Client fetches from `/_pinstripe/_shell/feature_flags.json`
- Views filtered at startup based on `featureFor()` requirements
- Empty object returned when no flags configured
