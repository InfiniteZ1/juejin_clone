import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { Banner, Tab, Tag } from '@/types/Common'
import Navigation from '@/components/Navigation'
import { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { getBanners, getTabs, getTags } from '@/api/homeApi'

const Home: React.FC<PropsType> = (props) => {
  const { banners, tabs, tags } = props
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
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<PropsType> = async () => {
  try {
    const bannerRes = (await getBanners()).data
    const banners: Banner[] = bannerRes.data.map((item) => item.attributes)
    const tabRes = (await getTabs()).data
    const tabs: Tab[] = tabRes.data.map((item) => item.attributes)
    const tagRes = (await getTags()).data
    const tags = tagRes.data.map((item) => item.attributes)

    return {
      props: {
        banners,
        tabs,
        tags
      },
      revalidate: 60
    }
  } catch (err) {
    console.log(err)

    return {
      props: {
        banners: [],
        tabs: [],
        tags: []
      },
      revalidate: 60
    }
  }
}

interface PropsType {
  banners: Banner[]
  tabs: Tab[]
  tags: Tag[]
}

export default Home
