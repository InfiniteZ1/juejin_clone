import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='zh-CN' data-theme='light'>
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
