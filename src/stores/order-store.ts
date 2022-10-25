import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Order } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])

  function insert(order: Omit<Order, 'ID'>): Promise<AxiosResponse<Order>> {
    return new Promise((resolve, reject) => {
      api.post('/orders', order).then(resolve).catch(reject)
    })
  }

  return { orders, insert }
})
