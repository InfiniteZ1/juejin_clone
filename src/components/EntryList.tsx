import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Article } from '@/types/Common'
import { getCreatedTimeToNow } from '@/utils/dateTransform'
import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons'
import { Image, Pagination } from 'antd'

const EntryList: React.FC<PropsType> = (porps) => {
  const { articles } = porps
  const [currentPage, setCurrentPage] = useState(2) //页码
  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * 4 //4篇一页
    return articles.slice(start, start + 4)
  }, [currentPage, articles])

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className='entry-list'>
      {currentArticles.map((item) => (
        <Link className='entry-link' href={`/detail/${item.id}`} target='_blank' key={item.id}>
          <div className='entry'>
            <ul className='entry-header'>
              <li className='entry-author'>{item.author}</li>
              <li className='dividing'></li>
              <li className='entry-time'>{getCreatedTimeToNow(item.createdAt)}</li>
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
                    {item.count >= 10000 ? item.count / 10000 + 'w' : item.count}
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
        </Link>
      ))}
      <Pagination
        current={currentPage}
        total={Math.ceil(articles.length / 4) * 10}
        showSizeChanger={false}
        onChange={onPageChange}
      />
    </div>
  )
}

interface PropsType {
  articles: Article[]
}

export default EntryList
