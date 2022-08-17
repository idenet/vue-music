export interface SongType {
  album: string
  duration: number
  id: number
  mid: string
  name: string
  pic: string
  singer: string
  url: string
  lyric?: string
}

interface lineType {
  time: number
  txt: string
}

export interface LyricType {
  curLine: number
  handler: ({ lineNum }: { lineNum: number }) => void
  lines: lineType[]
  lrc: string
  state: number
  tags: Record<string, string>
  seek: (startTime: number) => void
  stop: () => void
}
