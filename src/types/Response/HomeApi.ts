import { Response } from './Response'

export interface BannersResponse extends Response {
  data: {
    id: number
    attributes: {
      title: string
      badge: string | null
      createdAt: string
      publishedAt: string
      updatedAt: string
    }
  }[]
}
