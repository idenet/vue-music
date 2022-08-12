import { get } from './base'
import { SingerType } from '@/types/singers'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer: SingerType) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
