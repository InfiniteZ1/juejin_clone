import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='zh-CN'>
      <Head>
        <link rel='icon' href='/favicon.png'></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
