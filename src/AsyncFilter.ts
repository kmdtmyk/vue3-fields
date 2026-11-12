/**
 * 非同期関数を複数実行した時に、1件でも後に実行されて終わっているものがある時は、結果を受け取らずに無視する
 *
 * const asyncFilter = new AsyncFilter((result) => {
 *   // result: b → c の順に２回呼ばれる、aは呼ばれない
 * })
 *
 * asyncFilter.run(async () => {
 *   //500ms後に終了
 *   return 'a'
 * })
 *
 * asyncFilter.run(async () => {
 *   //100ms後に終了
 *   return 'b'
 * })
 *
 * asyncFilter.run(async () => {
 *   //200ms後に終了
 *   return 'c'
 * })
 *
 *
 */

export default class<T>{

  private nextRequestId = 0
  private lastCompletedRequestId = 0

  constructor(private readonly onResult: (result: T) => void){
  }

  run(func: () => Promise<T>): Promise<void>{
    const requestId = ++this.nextRequestId

    return func().then(
      (value) => {
        if(requestId < this.lastCompletedRequestId){
          return
        }
        this.lastCompletedRequestId = requestId
        this.onResult(value)
      },
      (error) => {
        if(requestId < this.lastCompletedRequestId){
          return
        }
        this.lastCompletedRequestId = requestId
        throw error
      },
    )
  }

}
