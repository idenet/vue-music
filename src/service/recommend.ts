import { get } from './base'
import { albumType } from '../types/album'

/**
 * 获取轮播图
 * @returns
 */
export function getRecommend() {
  return get('/api/getRecommend')
}

/**
 * 获取歌单详情
 * @param album
 * @returns
 */
export function getAlbum(album: albumType) {
  return get('api/getAlbum', {
    id: album.id,
  })
}
