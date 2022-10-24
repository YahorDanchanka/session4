<template>
  <q-page class="row items-center justify-evenly" padding>
    <q-table
      class="table"
      row-key="ID"
      v-model:pagination="pagination"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="[0]"
      :table-colspan="columns.length + 1"
      virtual-scroll
      @virtual-scroll="onScroll"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th class="text-left">Actions</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
          <q-td class="text-left">
            <a href="#">Edit </a>
            <a href="#">Remove</a>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useOrderItemStore } from 'stores/order-item-store'
import { OrderItemEndpoint } from 'src/types'

const orderItemStore = useOrderItemStore()
orderItemStore.fetch()

const columns = [
  {
    name: 'partName',
    label: 'Part Name',
    align: 'left',
    field: (row: OrderItemEndpoint) => row.part.Name,
  },
  {
    name: 'transactionType',
    label: 'Transaction Type',
    align: 'left',
    field: (row: OrderItemEndpoint) => row.order.transactionType.Name,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row: OrderItemEndpoint) => row.order.Date,
  },
  {
    name: 'amount',
    label: 'Amount',
    align: 'left',
    field: (row: OrderItemEndpoint) => row.Amount,
  },
  {
    name: 'source',
    label: 'Source',
    align: 'left',
    field: (row: OrderItemEndpoint) => row.order.sourceWarehouse?.Name || '-',
  },
  {
    name: 'destination',
    label: 'Destination',
    align: 'left',
    field: (row: OrderItemEndpoint) => row.order.destinationWarehouse?.Name,
  },
]

const pagination = reactive({ rowsPerPage: 0, page: 1 })

const rows = computed<OrderItemEndpoint[]>(() => <OrderItemEndpoint[]>orderItemStore.items)

function onScroll(details: { index: number }): void {
  /** Пропускаем выполнение, если данные не загружены */
  if (rows.value.length === 0) return

  /** Загружаем новые данные, если пользователь в конце таблицы */
  if (details.index >= rows.value.length - 5 && details.index <= rows.value.length) {
    orderItemStore.pagination.page++
    orderItemStore.fetch()
  }
}
</script>

<style lang="sass" scoped>
.table
  width: 70%
  height: 400px
</style>
