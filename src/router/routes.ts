import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useOrderItemStore } from 'stores/order-item-store'
import { useOrderStore } from 'stores/order-store'

async function loadOrder(to: RouteLocationNormalized) {
  const orderItemStore = useOrderItemStore()
  const orderStore = useOrderStore()
  const id = +(<number>(<unknown>to.params['id']))

  try {
    await orderItemStore.fetch(id)
    await orderStore.fetch(orderItemStore.findByID(id)!.OrderID)
  } catch (error) {
    return { name: 'inventoryManagement' }
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'inventoryManagement', path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'purchaseOrder', path: 'purchase-order', component: () => import('pages/PurchaseOrderPage.vue') },
      {
        name: 'editPurchaseOrder',
        path: 'edit-purchase-order/:id(\\d+)',
        component: () => import('pages/EditPurchaseOrderPage.vue'),
        beforeEnter: loadOrder,
      },
      {
        name: 'warehouseManagement',
        path: 'warehouse-management',
        component: () => import('pages/WarehouseManagementPage.vue'),
      },
      {
        name: 'editWarehouseManagement',
        path: 'warehouse-management/:id(\\d+)',
        component: () => import('pages/EditWarehouseManagementPage.vue'),
        beforeEnter: loadOrder,
      },
      { name: 'inventoryReport', path: 'inventory-report', component: () => import('pages/InventoryReportPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
