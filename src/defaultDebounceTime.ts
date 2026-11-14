// オートコンプリートとselect系で、入力時に連続でサーバーに問い合わせしないためのやつ
export default (query: string): number => {
  if(query === ''){
    return 0
  }
  return 200
}
