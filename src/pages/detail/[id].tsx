import React, { useEffect } from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Article, Author, Banner } from '@/types/Common'
import MarkdownIt from 'markdown-it' //https://markdown-it.docschina.org/, https://github.com/markdown-it/markdown-it
import Navigation from '@/components/Navigation'
import { Avatar, Image } from 'antd'
import { getDesignatedAuthor, getDesignatedPassage } from '@/api/detailApi'
import { getBanners } from '@/api/homeApi'

const Detail: React.FC<PropsType> = (props) => {
  const { banners, article, author } = props
  const md = new MarkdownIt()
  const mdResult = md.render(article ? article.content : '')

  return (
    <>
      <Head>
        <title>{article?.title + ' -掘金'}</title>
      </Head>
      <div className='detail'>
        <Navigation banners={banners} />
        <div className='detail-content'>
          <div className='detail-article'>
            <h1 className='article-title'>{article?.title}</h1>
            <div className='article-profile'>
              <Avatar src={author?.avatar} size={40} />
              <div className='article-info'>
                <div className='article-user'>
                  <span>{author?.name}</span>
                  <Image src={author?.level} alt='' preview={false} />
                </div>
                <div className='article-data'>
                  <span>{article ? new Date(article.createdAt).toLocaleString() : ''}</span>
                  <span>{article ? '阅读：' + article.count : ''}</span>
                </div>
              </div>
            </div>
            <Image src={article?.cover} alt='' preview={false} style={{ marginBottom: '15px' }} />
            <div
              className='article-content markdown-body'
              dangerouslySetInnerHTML={{ __html: mdResult }}
            ></div>
          </div>
          <div className='detail-aside'></div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<PropsType> = async (context) => {
  const id = context.params?.id

  if (typeof id != 'string') {
    return { notFound: true }
  }

  try {
    const bannerRes = (await getBanners()).data
    const banners = bannerRes.data.map((item) => item.attributes)
    const passageRes = (await getDesignatedPassage(id)).data
    const article: Article = { ...passageRes.data.attributes, id: passageRes.data.id }
    const authorRes = (await getDesignatedAuthor(article.authorId)).data
    const author = authorRes.data.attributes

    return {
      props: {
        banners,
        article,
        author
      },
      revalidate: 60
    }
  } catch (err) {
    console.log(err)

    return {
      props: {
        banners: [],
        article: null,
        author: null
      },
      revalidate: 60
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking' //注意一定要等待完毕后才渲染页面
  }
}

interface PropsType {
  banners: Banner[]
  article: Article | null
  author: Author | null
}

export default Detail
