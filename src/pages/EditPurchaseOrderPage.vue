<template>
  <q-page class="row items-center justify-evenly" padding>
    <PurchaseOrderForm class="page__form" :order="order" @submit="onSubmit" />
  </q-page>
</template>

<script lang="ts" setup>
import { OrderEndpoint, OrderItemEndpoint, PurchaseOrderForm as PurchaseOrderFormT } from 'src/types'
import { useOrderStore } from 'stores/order-store'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useOrderItemStore } from 'stores/order-item-store'
import { computed, onUnmounted } from 'vue'
import PurchaseOrderForm from 'components/PurchaseOrderForm.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const orderItemStore = useOrderItemStore()

const orderItemID = <string>route.params['id']

const orderItem = computed<OrderItemEndpoint>(() => <OrderItemEndpoint>orderItemStore.findByID(orderItemID))
const order = computed<OrderEndpoint>(() => <OrderEndpoint>orderStore.findByID(orderItem.value.OrderID))

function onSubmit(formData: PurchaseOrderFormT.FormData): void {
  /** Обновляем order */
  orderStore
    .update(order.value.ID, {
      TransactionTypeID: 1,
      SupplierID: formData.supplierID,
      SourceWarehouseID: null,
      DestinationWarehouseID: formData.warehouseID,
      Date: formData.date,
    })
    .then((response) => {
      const promises: Promise<any>[] = []

      formData.partsList.forEach((partItem) => {
        if (partItem?.orderItemID) return

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
        $q.notify({ type: 'positive', message: 'Purchase Order edited' })
      })
    })
}

onUnmounted(() => {
  orderItemStore.items = []
})
</script>

<style lang="sass" scoped>
.page__form
  width: 70%
</style>
