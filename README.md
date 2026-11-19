[![Test](https://github.com/kmdtmyk/vue3-fields/actions/workflows/test.yml/badge.svg)](https://github.com/kmdtmyk/vue3-fields/actions/workflows/test.yml)

## Installation

Vue 3 is required. Vue 2 is not supported.

```
npm install github:kmdtmyk/vue3-fields
```

## Usage

Import fields from the package root.

```vue
<script setup>
import {ref} from 'vue'
import {SelectField} from 'vue3-fields'

const value = ref('')
</script>

<template>
  <SelectField v-model="value" :records="['Vue', 'Vite']" />
</template>
```

The following components are available:

```js
import {
  DatetimeField,
  HiddenField,
  SelectField,
  TextField,
} from 'vue3-fields'
```

## Demo

https://kmdtmyk.github.io/vue3-fields/
