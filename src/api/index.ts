import request from '@/utils/request'

interface RandomJobsResponse {
  [key: string]: any
}

interface ReleaseResponse {
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

export function randomJobs(): Promise<RandomJobsResponse> {
  return request({
    url: '/api/random_jobs/',
    method: 'get'
  })
}

export function randomJobsATS(): Promise<RandomJobsResponse> {
  return request({
    url: '/api/random_jobs_ats/',
    method: 'get'
  })
}

export function release(): Promise<ReleaseResponse> {
  return request({
    url: 'https://api.github.com/repos/ets666/ets666-tool/releases/latest',
    method: 'get'
  })
}
