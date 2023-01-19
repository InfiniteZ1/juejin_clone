import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Banner } from '@/types/common'
import { CaretDownOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'
import { Image, Dropdown } from 'antd'

const Navigation: React.FC<PropsType> = (props) => {
  const { banners } = props
  const router = useRouter()
  const pathName = router.pathname
  const activeName = banners.find((item) => item.path == pathName)?.title
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const onDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open)
  }

  const onDropdownItemClick = () => {
    setDropdownOpen(false)
  }

  const dropdownItems: MenuProps['items'] = banners.map((item) => ({
    key: item.title,
    label: (
      <div className='banner-item' key={item.title} onClick={onDropdownItemClick}>
        <span className={'banner-item-text' + (pathName == item.path ? ' is-active' : '')}>
          {item.title}
        </span>
        {item.badge ? <span className='badge'>{item.badge}</span> : <></>}
      </div>
    )
  }))

  return (
    <div className='navigation'>
      <div className='logo'>
        <Image preview={false} src={'/logo.svg'} alt='' width={28} height={28} />
        <span>稀土掘金</span>
      </div>
      <ul className='banner'>
        {/* 只取前9个 */}
        {banners.slice(0, 9).map((item) => (
          <li className='banner-item' key={item.title}>
            <span className={'banner-item-text' + (activeName == item.title ? ' is-active' : '')}>
              {item.title}
            </span>
            {item.badge ? <span className='badge'>{item.badge}</span> : <></>}
          </li>
        ))}
        {banners.length > 9 ? (
          <Dropdown
            menu={{ items: dropdownItems.slice(9) }}
            trigger={['click']}
            placement='bottom'
            overlayClassName='banner-more-dropdown'
            onOpenChange={onDropdownOpenChange}
          >
            <li className={'banner-more' + (dropdownOpen ? ' is-active' : '')}>
              <span>更多</span>
              <CaretDownOutlined className='icon' />
            </li>
          </Dropdown>
        ) : (
          <></>
        )}
      </ul>
      <Dropdown
        menu={{ items: dropdownItems }}
        trigger={['click']}
        placement='bottom'
        overlayClassName='banner-dropdown'
        onOpenChange={onDropdownOpenChange}
      >
        <div className={'banner-more is-folder' + (dropdownOpen ? ' is-active' : '')}>
          <span className='banner-more-text'>{activeName}</span>
          <CaretDownOutlined className='icon' />
        </div>
      </Dropdown>
    </div>
  )
}

interface PropsType {
  banners: Banner[]
}

export default Navigation
