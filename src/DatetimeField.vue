<template lang='pug'>
input(
  type='datetime-local'
  v-model='value'
  step='1'
  max='9999-12-31T23:59:59'
)
</template>

<script lang='ts' setup>
import { computed } from 'vue'

const model = defineModel<string | null>()

const pad = (value: number) => String(value).padStart(2, '0')

// ISO8601 → datetime-local
const toDateTimeLocal = (value: string): string => {
  const date = new Date(value)

  if(Number.isNaN(date.getTime())){
    return ''
  }

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    'T',
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  ].join('')
}

// datetime-local → ISO8601
const toIso8601 = (value: string): string => {
  const date = new Date(value)

  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const offsetHours = Math.floor(Math.abs(offset) / 60)
  const offsetMinutes = Math.abs(offset) % 60

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    'T',
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    sign,
    `${pad(offsetHours)}:${pad(offsetMinutes)}`,
  ].join('')
}

const value = computed({
  get(): string {
    if(model.value == null){
      return ''
    }
    return toDateTimeLocal(model.value)
  },
  set(value: string){
    model.value = value === '' ? null : toIso8601(value)
  },
})
</script>
