import request from '@/utils/request'
import { BannersResponse } from '@/types/Response/HomeApi'

export const getBanners = () => {
  return request.get<BannersResponse>('/banners')
}
