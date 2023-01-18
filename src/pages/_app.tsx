import type { AppProps } from 'next/app'
import '@/styles/globals.scss'
import '@/styles/Home.scss'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
// import enUS from 'antd/locale/en_US'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}
