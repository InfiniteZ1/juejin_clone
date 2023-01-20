import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { Article, Banner, Sort, Tab, Tag } from '@/types/Common'
import Navigation from '@/components/Navigation'
import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons'
import { Image, MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { getBanners, getPassages, getSorts, getTabs, getTags } from '@/api/homeApi'

const Home: React.FC<PropsType> = (props) => {
  const { banners, tabs, tags, sorts, articles } = props
  const router = useRouter()
  const tab = typeof router.query.tab == 'string' ? router.query.tab : 'all'
  const tagMap = useMemo(() => {
    const map = new Map<string, string[]>()
    tags.forEach((item) => {
      const value = map.get(item.tab)
      map.set(item.tab, value ? [...value, item.tag] : [item.tag])
    })
    return map
  }, [tags])
  const [currentPage, setCurrentPage] = useState(1) //页码
  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * 4
    return articles.slice(start, start + 4)
  }, [currentPage, articles])

  const onTabClick = (tabName: string) => {
    return () => {
      router.push('/' + tabName)
    }
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
                label: <div>{tag}</div>
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
                <li className='passage-header-item' key={item.title}>
                  {item.title}
                </li>
              ))}
            </ul>
            <div className='entry-list'>
              {currentArticles.map((item) => (
                <div className='entry' key={item.id}>
                  <ul className='entry-header'>
                    <li className='entry-author'>{item.author}</li>
                    <li className='dividing'></li>
                    <li className='entry-time'>3天前</li>
                    <li className='dividing'></li>
                    <li className='entry-tag'>{item.tags}</li>
                  </ul>
                  <div className='entry-layout'>
                    <div className='entry-text'>
                      <h4>{item.title}</h4>
                      <p className='entry-content'>{item.description}</p>
                      <div className='entry-action'>
                        <span className='entry-action-item'>
                          <EyeOutlined className='icon' />
                          {item.count}
                        </span>
                        <span className='entry-action-item'>
                          <LikeOutlined className='icon' />
                          {item.good}
                        </span>
                        <span className='entry-action-item'>
                          <MessageOutlined className='icon' />
                          {item.comment}
                        </span>
                      </div>
                    </div>
                    <Image className='entry-image' src={item.cover} alt='' preview={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='content-aside'></div>
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

    return {
      props: {
        banners,
        tabs,
        tags,
        sorts,
        articles
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
        articles: []
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
}

export default Home
