import React from 'react'
import { useRouter } from 'next/router'

const Detail: React.FC = () => {
  const router = useRouter()
  console.log(router.query)

  return <div className='detail'>Detail</div>
}

export default Detail
