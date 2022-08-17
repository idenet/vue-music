export interface SingerType {
  id: number
  mid: string
  name: string
  pic: string
}

export interface SingersType {
  title: string
  list: SingerType[]
}
