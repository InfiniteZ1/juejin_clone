import React from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import Navigation from '@/components/Navigation'
import { Banner, Tab } from '@/types/common'
import { getBanners, getTabs } from '@/api/homeApi'

const Home: React.FC<PropsType> = (props) => {
  const { banners, tabs } = props

  return (
    <>
      <Head>
        <title>高仿稀土掘金</title>
      </Head>
      <div className='home'>
        <Navigation banners={banners} />
        <div className='tab-list'>
          {tabs.map((item) => (
            <span className='tab' key={item.title}>
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<PropsType> = async () => {
  try {
    const bannerRes = (await getBanners()).data
    const banners: Banner[] = bannerRes.data.map((item) => ({
      title: item.attributes.title,
      path: item.attributes.path,
      badge: item.attributes.badge
    }))
    const tabRes = (await getTabs()).data
    const tabs: Tab[] = tabRes.data.map((item) => ({ title: item.attributes.title }))

    return {
      props: {
        banners,
        tabs
      },
      revalidate: 60
    }
  } catch (err) {
    console.log(err)

    return {
      props: {
        banners: [],
        tabs: []
      },
      revalidate: 60
    }
  }
}

interface PropsType {
  banners: Banner[]
  tabs: Tab[]
}

export default Home
