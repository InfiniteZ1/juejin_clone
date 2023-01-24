import React, { useEffect, useMemo, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Article, Author, Banner } from '@/types/Common'
import MarkdownIt from 'markdown-it' //https://markdown-it.docschina.org/, https://github.com/markdown-it/markdown-it
import hightLight from 'highlight.js' //https://github.com/highlightjs/highlight.js
import 'highlight.js/styles/atom-one-dark.css' //highlight.js样式
import markdownItAnchor from 'markdown-it-anchor'
import Navigation from '@/components/Navigation'
import { Avatar, Image } from 'antd'
import { getDesignatedAuthor, getDesignatedPassage } from '@/api/detailApi'
import { getBanners, getPassages } from '@/api/homeApi'

const Detail: React.FC<PropsType> = (props) => {
  const { banners, article, author, articles } = props
  let headLength = 0 //最终会是目录h标签的数量
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hightLight.getLanguage(lang)) {
        try {
          return hightLight.highlight(str, { language: lang }).value
        } catch (__) {}
      }

      return '' // 使用额外的默认转义
    }
  }).use(markdownItAnchor, {
    level: [1, 2, 3], //只渲染h1,h2,h3
    slugify: () => 'head-' + headLength++
  })
  const mdResult = md.render(article ? article.content : '')
  const contentRef = useRef<HTMLDivElement>(null)
  const contentHeadRefs = useRef<HTMLHeadingElement[]>([])
  const relevantArticles = useMemo(
    () => articles.filter((item) => item.tab == article?.tab && item.id != article.id).slice(0, 10),
    [articles, article]
  ) //10篇相关文章

  const createCatalogItems = () => {
    let paddingLeft = 0

    return contentHeadRefs.current.map((item, index, arr) => {
      paddingLeft = item.tagName > arr[index - 1]?.tagName ? paddingLeft + 12 : 0

      return (
        <li className='detail-catalog-item' key={item.id}>
          <div style={{ paddingLeft }}>
            <Link className='detail-catalog-link' href={'#' + item.id}>
              {item.innerText}
            </Link>
          </div>
        </li>
      )
    })
  }

  useEffect(() => {
    contentHeadRefs.current.splice(0, contentHeadRefs.current.length)
    for (let i = 0; i < headLength; i++) {
      const key = 'head-' + i
      const heading = contentRef.current?.children.namedItem(key)
      if (heading) {
        contentHeadRefs.current.push(heading as HTMLHeadingElement)
      }
    }
    // console.log(contentHeadRefs.current)
  }, [headLength]) //这个headLength依赖可能没用，不过eslint警告了就加了吧

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
              ref={contentRef}
              className='article-content markdown-body'
              dangerouslySetInnerHTML={{ __html: mdResult }}
            ></div>
          </div>
          <div className='detail-aside'>
            <div className='detail-author'>
              <Avatar src={author?.avatar} size={48} />
              <div className='detail-author-info'>
                <div className='detail-author-name'>{author?.name}</div>
                <div className='detail-author-position'>
                  {author?.post + (author?.company ? ' @ ' + author.company : '')}
                </div>
              </div>
            </div>
            <div className='detail-relevant'>
              <div className='detail-relevant-title'>相关文章</div>
              <ul className='detail-relevant-list'>
                {relevantArticles.map((item) => (
                  <Link
                    className='relevant-link'
                    href={`/detail/${item.id}`}
                    target='_blank'
                    key={item.id}
                  >
                    <li className='relevant-item'>
                      <div className='relevant-item-title'>{item.title}</div>
                      <div className='relevant-item-data'>
                        <span>点赞：{item.good}</span>
                        <span>&nbsp;·&nbsp;</span>
                        <span>评论：{item.comment}</span>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            <div className='detail-catalog'>
              <div className='detail-catalog-title'>目录</div>
              <ul className='detail-catalog-list'>{createCatalogItems()}</ul>
            </div>
          </div>
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
    const passagesRes = (await getPassages()).data
    const articles: Article[] = passagesRes.data.map((item) => ({
      ...item.attributes,
      id: item.id
    }))

    return {
      props: {
        banners,
        article,
        author,
        articles
      },
      revalidate: 60
    }
  } catch (err) {
    console.log(err)

    return {
      props: {
        banners: [],
        article: null,
        author: null,
        articles: []
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
  articles: Article[]
}

export default Detail
