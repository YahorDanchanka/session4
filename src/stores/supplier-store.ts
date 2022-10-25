import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Supplier } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'

export const useSupplierStore = defineStore('supplier', () => {
  const suppliers = ref<Supplier[]>([])

  function fetch(): Promise<void> {
    return new Promise((resolve, reject) => {
      api
        .get('/suppliers')
        .then((response: AxiosResponse<Supplier[]>) => {
          suppliers.value = response.data
          resolve()
        })
        .catch(reject)
    })
  }

  return { suppliers, fetch }
})
