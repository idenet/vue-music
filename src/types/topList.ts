interface songListType {
  id: number
  singerName: string
  songName: string
}

export interface topListType {
  id: number
  name: string
  period: string
  pic: string
  songList: songListType[]
}
