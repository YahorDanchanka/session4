<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="layout__header">
      <q-bar class="layout__bar">
        <div class="cursor-pointer q-mr-sm" @click="router.push({ name: 'purchaseOrder' })">
          Purchase Order Management
        </div>
        <div class="cursor-pointer q-mr-sm">WareHouse Management</div>
        <div class="cursor-pointer">Inventory Report</div>
      </q-bar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="sass" scoped>
.layout__header
  background: white

.layout__bar
  background: white
  color: black
  border-bottom: 1px solid
</style>
