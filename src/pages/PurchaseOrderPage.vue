<template>
  <q-page class="row items-center justify-evenly" padding>
    <PurchaseOrderForm class="page__form" @submit="onSubmit" />
  </q-page>
</template>

<script lang="ts" setup>
import { PurchaseOrderForm as PurchaseOrderFormT } from 'src/types'
import PurchaseOrderForm from 'components/PurchaseOrderForm.vue'

function onSubmit(formData: PurchaseOrderFormT.FormData): void {
  console.log(formData)
}
</script>

<style lang="sass" scoped>
.page__form
  width: 70%
</style>
