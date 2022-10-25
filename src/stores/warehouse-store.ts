import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Warehouse } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'

export const useWarehouseStore = defineStore('warehouse', () => {
  const warehouses = ref<Warehouse[]>([])

  function fetch(): Promise<void> {
    return new Promise((resolve, reject) => {
      api
        .get('/warehouses')
        .then((response: AxiosResponse<Warehouse[]>) => {
          warehouses.value = response.data
          resolve()
        })
        .catch(reject)
    })
  }

  return { warehouses, fetch }
})
