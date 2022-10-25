<template>
  <q-page class="row items-center justify-evenly" padding>
    <PurchaseOrderForm class="page__form" @submit="onSubmit" />
  </q-page>
</template>

<script lang="ts" setup>
import { PurchaseOrderForm as PurchaseOrderFormT } from 'src/types'
import PurchaseOrderForm from 'components/PurchaseOrderForm.vue'
import { useOrderStore } from 'stores/order-store'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useOrderItemStore } from 'stores/order-item-store'

const $q = useQuasar()
const router = useRouter()
const orderStore = useOrderStore()
const orderItemStore = useOrderItemStore()

function onSubmit(formData: PurchaseOrderFormT.FormData): void {
  // $q.notify({ type: 'positive', message: 'Purchase Order created' })

  /** Создаем order */
  orderStore
    .insert({
      TransactionTypeID: 1,
      SupplierID: formData.supplierID,
      SourceWarehouseID: null,
      DestinationWarehouseID: formData.warehouseID,
      Date: formData.date,
    })
    .then((response) => {
      const promises: Promise<any>[] = []

      formData.partsList.forEach((partItem) => {
        promises.push(
          orderItemStore.insert({
            OrderID: response.data.ID,
            PartID: partItem.id,
            BatchNumber: partItem.batchNumber || null,
            Amount: partItem.amount,
          })
        )
      })

      Promise.all(promises).then(() => {
        router.push({ name: 'inventoryManagement' })
        $q.notify({ type: 'positive', message: 'Purchase Order created' })
      })
    })
}
</script>

<style lang="sass" scoped>
.page__form
  width: 70%
</style>
