import request from '@/utils/request'
import { BannersResponse, TabsResponse, TagsResponse } from '@/types/Response/HomeApi'

export const getBanners = () => {
  return request.get<BannersResponse>('/banners')
}

export const getTabs = () => {
  return request.get<TabsResponse>('/tabs')
}

export const getTags = () => {
  return request.get<TagsResponse>('/tags')
}
