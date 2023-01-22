import React from 'react'
import { Rank } from '@/types/Common'
import { Avatar, Image } from 'antd'

const AuthorRank: React.FC<PropsType> = (props) => {
  const { ranks } = props

  return (
    <div className='author-rank'>
      <div className='rank-title'>🎖️作者榜</div>
      <div className='rank-list'>
        {ranks.map((item) => (
          <div className='rank-list-item' key={item.author}>
            <Avatar src={item.avatar} size={45} />
            <div className='rank-user'>
              <div className='rank-user-profile'>
                <span className='rank-user-name'>{item.author}</span>
                <Image src={item.level} alt='' preview={false} width={35} height={16} />
              </div>
              <div className='rank-user-position'>
                {item.post + (item.company ? ' @ ' + item.company : '')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface PropsType {
  ranks: Rank[]
}

export default AuthorRank
