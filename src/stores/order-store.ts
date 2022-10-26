import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Order, OrderEndpoint } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'
import { find, unionBy } from 'lodash'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])

  /** Загружает новые записи */
  function fetch(id?: number | string) {
    const isSingle: boolean = !!id
    const endpointUrl = isSingle ? `/orders/${id}` : '/orders'

    return new Promise((resolve, reject) => {
      api
        .get(endpointUrl, {
          params: {
            expand: 'transactionType,sourceWarehouse,destinationWarehouse,orderItems.part',
          },
        })
        .then((response: AxiosResponse<OrderEndpoint | OrderEndpoint[]>) => {
          /** Добавляем только уникальные записи */
          orders.value = unionBy(
            orders.value,
            isSingle ? [<OrderEndpoint>response.data] : <OrderEndpoint[]>response.data,
            'ID'
          )

          resolve(true)
        })
        .catch(reject)
    })
  }

  function insert(order: Omit<Order, 'ID'>): Promise<AxiosResponse<Order>> {
    return new Promise((resolve, reject) => {
      api.post('/orders', order).then(resolve).catch(reject)
    })
  }

  function update(id: number, order: Omit<Order, 'ID'>): Promise<AxiosResponse<Order>> {
    return new Promise((resolve, reject) => {
      api.put(`/orders/${id}`, order).then(resolve).catch(reject)
    })
  }

  function findByID(id: number | string): Order | undefined {
    return find(orders.value, ['ID', +id])
  }

  return { orders, fetch, insert, update, findByID }
})
