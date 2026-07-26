import request from '@/utils/request'

export interface RandomJobsResponse {
  [key: string]: any
}

export interface ReleaseResponse {
  // GitHub Release API 返回的数据结构
  id: number
  tag_name: string
  name: string
  body: string
  html_url: string
  assets: Array<{
    id: number
    name: string
    browser_download_url: string
  }>
  [key: string]: any
}

export interface I18nItem {
  language: string;
  server: string;
  departure_city: string;
  departure_company: string;
  destination_city: string;
  destination_company: string;
  cargo: string;
}

export interface RandomJob {
  supported_savegame_version: number;
  assembly_time: string; // ISO 8601 格式的时间字符串
  server: string;
  departure_city: string;
  departure_company: string;
  departure_coordinates: string; // 格式: "(x, y, z) (qx, qy, qz, qw)"
  destination_city: string;
  destination_company: string;
  shortest_distance_km: number;
  ferry_distance_km?: number; // 可选，因为有些任务可能没有渡轮
  cargo: string;
  trailer_variant: string;
  trailer_definition: string;
  units_count: number;
  i18n: I18nItem[];
  company_truck: string;
}


export function release(): Promise<ReleaseResponse> {
  return request({
    url: 'https://api.github.com/repos/ets666/ets666-tool/releases/latest',
    method: 'get'
  })
}
