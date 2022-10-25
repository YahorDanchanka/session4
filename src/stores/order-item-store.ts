import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { OrderItem, OrderItemEndpoint } from 'src/types'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'
import { unionBy } from 'lodash'

export interface Pagination {
  page: number
}

export const useOrderItemStore = defineStore('order-item', () => {
  const items = ref<OrderItem[]>([])
  const pagination = reactive<Pagination>({ page: 1 })

  /** Загружает новые записи. Поддерживается пагинация */
  function fetch(): Promise<void> {
    return new Promise((resolve, reject) => {
      api
        .get('/order-item', {
          params: {
            expand: 'order.transactionType,order.sourceWarehouse,order.destinationWarehouse,part',
            page: pagination.page,
          },
        })
        .then((response: AxiosResponse<OrderItemEndpoint[]>) => {
          /** Устанавливаем значения для пагинации */
          pagination.page = +response.headers['x-pagination-current-page']!

          /** Добавляем только уникальные записи */
          items.value = unionBy(items.value, response.data, 'ID')
          resolve()
        })
        .catch(reject)
    })
  }

  function insert(orderItem: Omit<OrderItem, 'ID'>) {
    return new Promise((resolve, reject) => {
      api.post('/order-item', orderItem).then(resolve).catch(reject)
    })
  }

  return { items, pagination, fetch, insert }
})
