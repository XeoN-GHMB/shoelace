---
meta:
  title: Vue
  description: Tips for using Shoelace in your Vue 3 app.
---

# Vue

Vue [plays nice](https://custom-elements-everywhere.com/#vue) with custom elements, so you can use Shoelace in your Vue apps with ease.

:::tip
These instructions are for Vue 3 and above. If you're using Vue 2, please see the [Vue 2 instructions](/frameworks/vue-2).
:::

## Installation

To add Shoelace to your Vue app, install the package from npm.

```bash
npm install @viur/shoelace
```

Next, [include a theme](/getting-started/themes) and set the [base path](/getting-started/installation#setting-the-base-path) for icons and other assets. In this example, we'll import the light theme and use the CDN as a base path.

```jsx
import '@viur/shoelace/dist/themes/viur.css';
import { setBasePath } from '@viur/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@viur/shoelace@%VERSION%/%CDNDIR%/');
```

:::tip
If you'd rather not use the CDN for assets, you can create a build task that copies `node_modules/@viur/shoelace/dist/assets` into a public folder in your app. Then you can point the base path to that folder instead.
:::

## Configuration

You'll need to tell Vue to ignore Shoelace components. This is pretty easy because they all start with `sl-`.

```js
import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('sl-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
```

Now you can start using Shoelace components in your app!

## Local and optimized Configuration
This config copies the assets to public/viur-shoelace and chunks the components without hashing

```js
import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    copy({
      targets: [
        {
          src: path.join(__dirname, "node_modules", "@viur", "viur-shoelace", "dist", "assets"),
          dest: path.join(__dirname, 'public', "viur-shoelace")
        }
      ]
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('sl-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunkinfo) => {
          if (chunkinfo['moduleIds'].filter(x => x.includes('node_modules/@viur/shoelace/dist/components')).length > 0) {
            return `[name].js`
          } else {
            return `[name]-[hash].js`
          }

        },
        manualChunks(id) {
          if (id.includes('node_modules/@viur/shoelace/dist/components')) {
            return "viur-shoelace/component_" + id.split("/").slice(-2)[0];
          }
        }
      }
    }
  }
});
```

## Usage

### QR code generator example

```html
<template>
  <div class="container">
    <h1>QR code generator</h1>

    <sl-input maxlength="255" clearable label="Value" v-model="qrCode"></sl-input>

    <sl-qr-code :value="qrCode"></sl-qr-code>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@viur/shoelace/dist/components/qr-code/qr-code.js';
  import '@viur/shoelace/dist/components/input/input.js';

  const qrCode = ref();
</script>

<style>
  .container {
    max-width: 400px;
    margin: 0 auto;
  }

  sl-input {
    margin: var(--sl-spacing-large) 0;
  }
</style>
```

### Binding Complex Data

When binding complex data such as objects and arrays, use the `.prop` modifier to make Vue bind them as a property instead of an attribute.

```html
<sl-color-picker :swatches.prop="mySwatches" />
```

:::tip
Are you using Shoelace with Vue? [Help us improve this page!](https://github.com/shoelace-style/shoelace/blob/next/docs/frameworks/vue.md)
:::

### Slots

To use Shoelace components with slots, follow the Vue documentation on using [slots with custom elements](https://vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue).

Here is an example:

```html
<sl-drawer label="Drawer" placement="start" class="drawer-placement-start" :open="drawerIsOpen">
  This drawer slides in from the start.
  <div slot="footer">
    <sl-button variant="primary" @click=" drawerIsOpen = false">Close</sl-button>
  </div>
</sl-drawer>
```
