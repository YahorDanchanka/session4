export type Decimal = string
export type TinyInt = 0 | 1

export interface OrderItem {
  ID: number
  OrderID: number
  PartID: number
  BatchNumber: string | null
  Amount: Decimal
}

export interface Order {
  ID: number
  TransactionTypeID: number
  SupplierID: number | null
  SourceWarehouseID: number | null
  DestinationWarehouseID: number | null
  Date: string
}

export interface Part {
  ID: number
  Name: string
  EffectiveLife: number | null
  BatchNumberHasRequired: TinyInt | null
  MinimumAmount: number | null
}

export interface Meta {
  ID: number
  Name: string
}

export type TransactionType = Meta
export type Warehouse = Meta
export type Supplier = Meta

export type OrderItemEndpoint = OrderItem & {
  order: Order & {
    transactionType: TransactionType
    sourceWarehouse: Warehouse | null
    destinationWarehouse: Warehouse | null
  }
  part: Part
}

export namespace PurchaseOrderForm {
  export interface PartItem {
    id: number
    partName: string
    batchNumber: string
    amount: Decimal
  }

  export interface FormData {
    supplierID: number
    warehouseID: number
    date: string
    partID: number
    batchNumber: string
    amount: Decimal
    partsList: PartItem[]
  }
}
