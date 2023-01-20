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
