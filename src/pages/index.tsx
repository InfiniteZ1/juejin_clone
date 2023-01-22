import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { Advertisement, Article, AttributeData, Banner, Rank, Sort, Tab, Tag } from '@/types/Common'
import Navigation from '@/components/Navigation'
import EntryList from '@/components/EntryList'
import AuthorRank from '@/components/AuthorRank'
import { CloseOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'
import { Dropdown, Image } from 'antd'
import {
  getAdvertisements,
  getBanners,
  getPassages,
  getRanks,
  getSorts,
  getTabs,
  getTags
} from '@/api/homeApi'

const Home: React.FC<PropsType> = (props) => {
  const { banners, tabs, tags, sorts, articles, advertisements, ranks } = props
  const router = useRouter()
  const tab = typeof router.query.tab == 'string' ? router.query.tab : 'all' //路由tab参数
  const tag = typeof router.query.tag == 'string' ? decodeURIComponent(router.query.tag) : '' //路由tag参数，解除utf8编码
  const sort = typeof router.query.sort == 'string' ? router.query.sort : 'all'
  const tagMap = useMemo(() => {
    const map = new Map<string, string[]>()
    tags.forEach((item) => {
      const value = map.get(item.tab)
      map.set(item.tab, value ? [...value, item.tag] : [item.tag])
    })
    return map
  }, [tags])
  const filteredArticles = useMemo(() => {
    let newArticles =
      tab == 'all'
        ? articles
        : articles.filter((item) => item.tab == tab && item.tags.includes(tag))
    newArticles =
      sort == 'all' ? newArticles : newArticles.filter((item) => item.sorts?.includes(sort))
    return newArticles
  }, [articles, tab, tag, sort])
  const [visibleAdvertisements, setVisibleAdvertisements] = useState(
    advertisements.map((item) => ({ ...item, show: true }))
  ) //正在显示的广告

  const onTabClick = (tabName: string) => {
    return () => router.push('/' + tabName)
  }

  const onTagClick = (tabName: string, tagName: string) => {
    return () => router.push(`/${tabName}/${tagName}`)
  }

  const onSortClick = (sortName: string) => {
    return () => {
      const { query } = router
      const [paramPath] = router.asPath.split('?')
      const params = paramPath.split('/').filter((item) => item)
      const paramKeys = Object.keys(query).filter((item) => params.includes(query[item] as string))
      const newQuery: { [key: string]: any } = {}
      Object.keys(query)
        .filter((item) => !paramKeys.includes(item))
        .forEach((key) => {
          newQuery[key] = query[key]
        })
      newQuery['sort'] = sortName
      // console.log(newQuery)
      router.push({ pathname: paramPath, query: newQuery })
    }
  }

  const closeAdvertisement = (adverId: number) => {
    return () =>
      setVisibleAdvertisements(
        visibleAdvertisements.map((item) => (item.id == adverId ? { ...item, show: false } : item))
      )
  }

  return (
    <>
      <Head>
        <title>高仿稀土掘金</title>
      </Head>
      <div className='home'>
        <Navigation banners={banners} />
        <div className='tab-list-wrapper'>
          <div className='tab-list'>
            {tabs.map((item) => {
              const itemTags = tagMap.get(item.tab)
              const dropdownItems: MenuProps['items'] = itemTags?.map((tag) => ({
                key: tag,
                label: <div onClick={onTagClick(item.tab, tag)}>{tag}</div>
              }))

              return (
                <Dropdown
                  key={item.title}
                  menu={{ items: dropdownItems }}
                  disabled={itemTags ? false : true}
                  overlayClassName='tab-dropdown'
                >
                  <span
                    className={'tab' + (tab == item.tab ? ' is-active' : '')}
                    onClick={onTabClick(item.tab)}
                  >
                    {item.title}
                  </span>
                </Dropdown>
              )
            })}
          </div>
        </div>
        <div className='home-content'>
          <div className='content-passage'>
            <ul className='passage-header'>
              {sorts.map((item) => (
                <li
                  className={'passage-header-item' + (sort == item.sort ? ' is-active' : '')}
                  key={item.title}
                  onClick={onSortClick(item.sort)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
            <EntryList articles={filteredArticles} />
          </div>
          <div className='content-aside'>
            <div className='advertisement'>
              {visibleAdvertisements
                .filter((item) => item.show)
                .map((item) => (
                  <div className='advertisement-item' key={item.id}>
                    <Image src={item.attributes.url} alt={item.attributes.title} preview={false} />
                    <CloseOutlined className='icon' onClick={closeAdvertisement(item.id)} />
                    <div className='advertisement-label'>广告</div>
                  </div>
                ))}
            </div>
            <div className='app-block'>
              <Image src='/QRcode.png' alt='' width={50} height={50} preview={false} />
              <div className='app-block-content'>
                <div className='app-block-header'>下载稀土掘金APP</div>
                <div className='app-block-desc'>一个帮助开发者成长的社区</div>
              </div>
            </div>
            <AuthorRank ranks={ranks} />
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<PropsType> = async () => {
  try {
    const bannerRes = (await getBanners()).data
    const banners = bannerRes.data.map((item) => item.attributes)
    const tabRes = (await getTabs()).data
    const tabs = tabRes.data.map((item) => item.attributes)
    const tagRes = (await getTags()).data
    const tags = tagRes.data.map((item) => item.attributes)
    const sortRes = (await getSorts()).data
    const sorts = sortRes.data.map((item) => item.attributes)
    const passageRes = (await getPassages()).data
    const articles: Article[] = passageRes.data.map((item) => ({ ...item.attributes, id: item.id }))
    const advertisementRes = (await getAdvertisements()).data
    const advertisements = advertisementRes.data
    const rankRes = (await getRanks()).data
    const ranks = rankRes.data.map((item) => item.attributes)

    return {
      props: {
        banners,
        tabs,
        tags,
        sorts,
        articles,
        advertisements,
        ranks
      },
      revalidate: 60
    }
  } catch (err) {
    console.log(err)

    return {
      props: {
        banners: [],
        tabs: [],
        tags: [],
        sorts: [],
        articles: [],
        advertisements: [],
        ranks: []
      },
      revalidate: 60
    }
  }
}

interface PropsType {
  banners: Banner[]
  tabs: Tab[]
  tags: Tag[]
  sorts: Sort[]
  articles: Article[]
  advertisements: AttributeData<Advertisement>[]
  ranks: Rank[]
}

export default Home
