import request from '@/utils/request'
import { DesignatedAuthorResponse, DesignatedPassageResponse } from '@/types/Response/DetailApi'

export const getDesignatedPassage = (id: string | number) => {
  return request.get<DesignatedPassageResponse>(`/passages/${id}`)
}

export const getDesignatedAuthor = (id: string | number) => {
  return request.get<DesignatedAuthorResponse>(`/authors/${id}`)
}
