import { get } from './base'

/**
 * 获取轮播图
 * @returns
 */
export function getRecommend () {
  return get('/api/getRecommend')
}
