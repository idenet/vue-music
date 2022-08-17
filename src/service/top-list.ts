import { get } from './base'
import { topListType } from '../types/topList'

/**
 * 获取排行榜
 * @returns
 */
export function getTopList() {
  return get('/api/getTopList')
}

/**
 * 获取榜单详情
 * @returns
 */
export function getTopDetail(top: topListType) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period,
  })
}
