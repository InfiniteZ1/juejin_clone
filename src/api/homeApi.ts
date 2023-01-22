import request from '@/utils/request'
import {
  AdvertisementsResponse,
  BannersResponse,
  PassageSResponse,
  RanksResponse,
  SortsResponse,
  TabsResponse,
  TagsResponse
} from '@/types/Response/HomeApi'

export const getBanners = () => {
  return request.get<BannersResponse>('/banners')
}

export const getTabs = () => {
  return request.get<TabsResponse>('/tabs')
}

export const getTags = () => {
  return request.get<TagsResponse>('/tags')
}

export const getSorts = () => {
  return request.get<SortsResponse>('/sorts')
}

export const getPassages = () => {
  return request.get<PassageSResponse>('/passages')
}

export const getAdvertisements = () => {
  return request.get<AdvertisementsResponse>('/advertisements')
}

export const getRanks = () => {
  return request.get<RanksResponse>('/ranks')
}
