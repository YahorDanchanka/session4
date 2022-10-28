<template>
  <q-page class="row items-center justify-evenly" padding>
    <q-form class="page__form">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-x-md">
            <div class="col">
              <q-select
                v-model="formData.warehouseID"
                label="Warehouse"
                option-value="ID"
                option-label="Name"
                :options="warehouses"
                emit-value
                map-options
              />
            </div>
            <div class="col">
              Inventory type:
              <q-option-group v-model="formData.inventoryType" :options="inventoryTypes" inline />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-table :rows="rows" :columns="columns">
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
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
                <q-td class="text-left">
                  <a v-if="props.row.BatchNumber" href="#">View Batch Numbers</a>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { InventoryReport, Warehouse } from 'src/types'
import { useWarehouseStore } from 'stores/warehouse-store'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'

const warehouseStore = useWarehouseStore()
warehouseStore.fetch()

const rows = ref<InventoryReport.Endpoint[]>([])
const formData = reactive<InventoryReport.FormData>({
  warehouseID: 1,
  inventoryType: 'current',
})

const columns = [
  {
    name: 'partName',
    label: 'Part Name',
    align: 'left',
    field: (row: InventoryReport.Endpoint) => row.part.Name,
  },
  {
    name: 'currentStock',
    label: 'Current Stock',
    align: 'left',
    field: (row: InventoryReport.Endpoint) => row.currentStock,
  },
  {
    name: 'receivedStock',
    label: 'Received Stock',
    align: 'left',
    field: (row: InventoryReport.Endpoint) => row.receivedStock,
  },
]

const inventoryTypes = [
  {
    label: 'Current Stock',
    value: 'current',
  },
  {
    label: 'Received Stock',
    value: 'received',
  },
  {
    label: 'Out of Stock',
    value: 'out',
  },
]

const warehouses = computed<Warehouse[]>(() => warehouseStore.warehouses)

/** Загружает детали */
function fetch() {
  const filter: { orderSourceWarehouseID?: object; orderDestinationWarehouseID?: object } = {}

  if (formData.inventoryType === 'current') {
    filter.orderDestinationWarehouseID = {
      eq: formData.warehouseID,
    }
  }

  if (formData.inventoryType === 'received') {
    filter.orderSourceWarehouseID = {
      neq: formData.warehouseID,
    }

    filter.orderDestinationWarehouseID = {
      eq: formData.warehouseID,
    }
  }

  if (formData.inventoryType === 'out') {
    filter.orderSourceWarehouseID = {
      eq: formData.warehouseID,
    }
  }

  api
    .get('/order-item', {
      params: {
        filter,
        expand: 'order,part',
        group: 1,
        'per-page': 1000,
      },
    })
    .then((response: AxiosResponse<InventoryReport.Endpoint[]>) => {
      rows.value = response.data

      rows.value.forEach((orderItem) => {
        api
          .get('/order-item/current-stock-count', {
            params: { warehouseID: formData.warehouseID, partID: orderItem.PartID, batchNumber: orderItem.BatchNumber },
          })
          .then((response: AxiosResponse<number>) => {
            orderItem.currentStock = response.data
          })

        api
          .get('/order-item/received-stock-count', {
            params: { warehouseID: formData.warehouseID, partID: orderItem.PartID, batchNumber: orderItem.BatchNumber },
          })
          .then((response: AxiosResponse<number>) => {
            orderItem.receivedStock = response.data
          })
      })
    })
}

watch(
  formData,
  () => {
    fetch()
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
.page__form
  width: 70%
</style>
