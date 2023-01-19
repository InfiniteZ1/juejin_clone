import { Response } from './Response'

type BannerAttribute = {
  title: string
  path: string
  badge: string | null
  createdAt: string
  publishedAt: string
  updatedAt: string
}

export type BannersResponse = Response<BannerAttribute>

type TabAttribute = {
  title: string
  createdAt: string
  publishedAt: string
  updatedAt: string
}

export type TabsResponse = Response<TabAttribute>
