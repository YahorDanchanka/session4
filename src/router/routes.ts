import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'inventoryManagement', path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'purchaseOrder', path: 'purchase-order', component: () => import('pages/PurchaseOrderPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
