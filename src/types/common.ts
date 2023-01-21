export interface AttributeData<T> {
  id: number
  attributes: T
}

export interface Attribute {
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Banner extends Attribute {
  title: string
  path: string
  badge: string | null
}

export interface Tab extends Attribute {
  title: string
  tab: string
}

export interface Tag extends Attribute {
  tab: string
  tag: string
}

export interface Sort extends Attribute {
  title: string
  sort: string
}

export interface Passage extends Attribute {
  title: string
  cover: string
  description: string
  content: string
  count: number
  good: number
  comment: number
  author: string
  tab: string
  tags: string
  sorts: string | null
}

export interface Article extends Passage {
  id: number
}

export interface Advertisement extends Attribute {
  title: string
  url: string
}
