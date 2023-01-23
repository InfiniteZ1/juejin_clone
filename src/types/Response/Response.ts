export interface Response<T> {
  data: {
    id: number
    attributes: T
  }[]
  meta: {
    pagination: {
      page: number
      pageCount: number
      pageSize: number
      total: number
    }
  }
}

export interface DesignatedResponse<T> {
  data: {
    id: number
    attributes: T
  }
  meta: {}
}
