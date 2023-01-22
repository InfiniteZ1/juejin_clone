import { Response } from './Response'
import { Advertisement, Banner, Passage, Rank, Sort, Tab, Tag } from '../Common'

export type BannersResponse = Response<Banner>

export type TabsResponse = Response<Tab>

export type TagsResponse = Response<Tag>

export type SortsResponse = Response<Sort>

export type PassageSResponse = Response<Passage>

export type AdvertisementsResponse = Response<Advertisement>

export type RanksResponse = Response<Rank>
