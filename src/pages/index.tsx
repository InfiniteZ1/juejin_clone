import React, { useState } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getBanners } from '@/api/homeApi'
import { Image } from 'antd'

const Home: React.FC<PropsType> = (props) => {
  const { banners } = props

  return (
    <>
      <Head>
        <title>高仿稀土掘金</title>
      </Head>
      <div className='home'>
        <div className='navigation'>
          <div className='logo'>
            <Image preview={false} src={'/logo.svg'} alt='' />
          </div>
          <div className='banner'>
            {banners.map((item) => (
              <span key={item.title}>{item.title}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await getBanners()
    const result = res.data
    const banners: Banner[] = result.data.map((item) => ({
      title: item.attributes.title,
      badge: item.attributes.badge
    }))

    return {
      props: {
        banners: banners
      },
      revalidate: 60
    }
  } catch (err) {
    console.log(err)

    return {
      props: {},
      revalidate: 60
    }
  }
}

type Banner = { title: string; badge: string | null }

interface PropsType {
  banners: Banner[]
}

export default Home
