import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { OrderItem, OrderItemEndpoint } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'
import { filter, find, unionBy } from 'lodash'

export interface Pagination {
  page: number
}

export const useOrderItemStore = defineStore('order-item', () => {
  const items = ref<OrderItem[]>([])
  const pagination = reactive<Pagination>({ page: 1 })

  /** Загружает новые записи. Поддерживается пагинация */
  function fetch(id?: number | string): Promise<boolean> {
    const isSingle: boolean = !!id
    const endpointUrl = isSingle ? `/order-item/${id}` : '/order-item'

    return new Promise((resolve, reject) => {
      api
        .get(endpointUrl, {
          params: {
            expand: 'order.transactionType,order.sourceWarehouse,order.destinationWarehouse,part',
            page: pagination.page,
          },
        })
        .then((response: AxiosResponse<OrderItemEndpoint | OrderItemEndpoint[]>) => {
          if (!isSingle) {
            /** Устанавливаем значения для пагинации */
            pagination.page = +response.headers['x-pagination-current-page']!
          }

          /** Добавляем только уникальные записи */
          items.value = unionBy(
            items.value,
            isSingle ? [<OrderItemEndpoint>response.data] : <OrderItemEndpoint[]>response.data,
            'ID'
          )

          resolve(true)
        })
        .catch(reject)
    })
  }

  function insert(orderItem: Omit<OrderItem, 'ID'>) {
    return new Promise((resolve, reject) => {
      api.post('/order-item', orderItem).then(resolve).catch(reject)
    })
  }

  function remove(id: number, mutate: boolean = true) {
    return new Promise((resolve, reject) => {
      api
        .delete(`/order-item/${id}`)
        .then((response) => {
          if (mutate) {
            items.value = filter(items.value, (o) => o.ID !== id)
          }

          resolve(response)
        })
        .catch(reject)
    })
  }

  function findByID(id: number | string): OrderItem | undefined {
    return find(items.value, ['ID', +id])
  }

  function filterByOrderID(orderID: number): Promise<AxiosResponse<OrderItem[]>> {
    return new Promise((resolve, reject) => {
      api
        .get('/order-item/', {
          params: {
            filter: {
              OrderID: {
                eq: orderID,
              },
            },
          },
        })
        .then(resolve)
        .catch(reject)
    })
  }

  return { items, pagination, fetch, insert, remove, findByID, filterByOrderID }
})
