import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Part } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'

export const usePartStore = defineStore('part', () => {
  const parts = ref<Part[]>([])

  function fetch(): Promise<void> {
    return new Promise((resolve, reject) => {
      api
        .get('/parts')
        .then((response: AxiosResponse<Part[]>) => {
          parts.value = response.data
          resolve()
        })
        .catch(reject)
    })
  }

  return { parts, fetch }
})
