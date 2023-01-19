import request from '@/utils/request'
import { BannersResponse, TabsResponse } from '@/types/Response/HomeApi'

export const getBanners = () => {
  return request.get<BannersResponse>('/banners')
}

export const getTabs = () => {
  return request.get<TabsResponse>('/tabs')
}
