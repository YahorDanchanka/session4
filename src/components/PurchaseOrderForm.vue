<template>
  <q-form @submit.prevent="onSubmit">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-x-md">
          <div class="col">
            <q-select
              v-model="formData.supplierID"
              label="Suppliers"
              option-value="ID"
              option-label="Name"
              :options="suppliers"
              emit-value
              map-options
            />
            <q-input
              v-model="formData.date"
              type="date"
              :rules="[(val) => (val && val.length > 0) || 'Please fill the date']"
            />
          </div>
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
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-x-md items-center">
          <div class="col-xs-4">
            <q-select
              v-model="formData.partID"
              label="Part Name"
              option-value="ID"
              option-label="Name"
              :options="parts"
              emit-value
              map-options
              hide-bottom-space
            />
          </div>
          <div class="col-xs-3">
            <q-input
              label="Batch Number"
              v-model="formData.batchNumber"
              :disable="isBatchNumberFieldDisabled"
              :rules="isBatchNumberFieldDisabled ? [] : [(val) => (val && val.length > 0) || 'Please type something']"
              hide-bottom-space
            />
          </div>
          <div class="col-xs-3">
            <q-input
              type="number"
              step="0.01"
              label="Amount"
              v-model="formData.amount"
              :rules="[(val) => (parseFloat(val) && parseFloat(val) >= 1) || 'Type positive number']"
              hide-bottom-space
            />
          </div>
          <div class="col-xs-2 text-right">
            <q-btn color="primary" label="Add to list" icon="add" no-caps @click="addPartItem" />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-table :rows="formData.partsList" :columns="columns">
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
                <a href="#" @click.prevent="removePart(props.row)">Remove</a>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn type="submit" color="primary" label="Submit" no-caps />
        <q-btn color="negative" label="Cancel" no-caps @click="router.push({ name: 'inventoryManagement' })" />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { OrderItem, Part, PurchaseOrderForm, Supplier, Warehouse } from 'src/types'
import { useSupplierStore } from 'stores/supplier-store'
import { useWarehouseStore } from 'stores/warehouse-store'
import { usePartStore } from 'stores/part-store'
import { cloneDeep, filter, find } from 'lodash'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import PartItem = PurchaseOrderForm.PartItem

const emit = defineEmits(['submit'])
defineProps<{ orderItem?: OrderItem }>()

const $q = useQuasar()
const router = useRouter()
const supplierStore = useSupplierStore()
supplierStore.fetch()
const warehouseStore = useWarehouseStore()
warehouseStore.fetch()
const partStore = usePartStore()
partStore.fetch()

const columns = [
  {
    name: 'partName',
    label: 'Part Name',
    align: 'left',
    field: (row: PartItem) => row.partName,
  },
  {
    name: 'batchNumber',
    label: 'Batch Number',
    align: 'left',
    field: (row: PartItem) => row.batchNumber,
  },
  {
    name: 'amount',
    label: 'Amount',
    align: 'left',
    field: (row: PartItem) => row.amount,
  },
]

const formData = reactive<PurchaseOrderForm.FormData>({
  supplierID: 1,
  warehouseID: 1,
  date: '',
  partID: 1,
  batchNumber: '',
  amount: '',
  partsList: [],
})

const suppliers = computed<Supplier[]>(() => supplierStore.suppliers)
const warehouses = computed<Warehouse[]>(() => warehouseStore.warehouses)
const parts = computed<Part[]>(() => partStore.parts)
const selectedPart = computed<Part | undefined>(() => find(parts.value, ['ID', formData.partID]))
const isBatchNumberFieldDisabled = computed<boolean>(() => !selectedPart.value?.BatchNumberHasRequired)

function addPartItem(): void {
  const part = find(parts.value, ['ID', formData.partID])
  if (!part) return

  const addedPartItem = { partName: part.Name, batchNumber: formData.batchNumber, amount: formData.amount }

  /** Список может содержать несколько деталей с одинаковыми названиями, только если они имеют разные номера партий */
  const hasDuplicatePart: boolean = !!find(formData.partsList, {
    partName: part.Name,
    batchNumber: addedPartItem.batchNumber,
  })

  if (hasDuplicatePart) {
    $q.notify({ type: 'negative', message: 'Part already exists' })
    return
  }

  formData.partsList.push(addedPartItem)
}

function removePart(partItem: PartItem): void {
  formData.partsList = filter(formData.partsList, (o) => o !== partItem)
}

function onSubmit(): void {
  if (formData.partsList.length === 0) {
    $q.notify({ type: 'negative', message: 'One part needs to be added to the order' })
    return
  }

  emit('submit', cloneDeep(formData))
}

/** Удаляем текст из Batch Number, если BatchNumberHasRequired=false */
watch(isBatchNumberFieldDisabled, () => {
  if (!selectedPart.value?.BatchNumberHasRequired && formData.batchNumber) {
    formData.batchNumber = ''
  }
})
</script>
