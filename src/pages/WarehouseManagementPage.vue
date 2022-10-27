<template>
  <q-page class="row items-center justify-evenly" padding>
    <WarehouseManagementForm class="page__form" @submit="onSubmit" />
  </q-page>
</template>

<script lang="ts" setup>
import { WarehouseManagementForm as WarehouseManagementFormT } from 'src/types'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import WarehouseManagementForm from 'components/WarehouseManagementForm.vue'
import { useOrderStore } from 'stores/order-store'
import { useOrderItemStore } from 'stores/order-item-store'

const $q = useQuasar()
const router = useRouter()
const orderStore = useOrderStore()
const orderItemStore = useOrderItemStore()

function onSubmit(formData: WarehouseManagementFormT.FormData): void {
  /** Создаем order */
  orderStore
    .insert({
      TransactionTypeID: 2,
      SupplierID: null,
      SourceWarehouseID: formData.sourceWarehouseID,
      DestinationWarehouseID: formData.destinationWarehouseID,
      Date: formData.date,
    })
    .then((response) => {
      const promises: Promise<any>[] = []

      formData.partsList.forEach((partItem) => {
        promises.push(
          orderItemStore.insert({
            OrderID: response.data.ID,
            PartID: partItem.partID,
            BatchNumber: partItem.batchNumber || null,
            Amount: partItem.amount,
          })
        )
      })

      Promise.all(promises).then(() => {
        router.push({ name: 'inventoryManagement' })
        $q.notify({ type: 'positive', message: 'Warehouse management created' })
      })
    })
}
</script>

<style lang="sass" scoped>
.page__form
  width: 70%
</style>
