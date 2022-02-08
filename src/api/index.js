import request from '@/utils/request.js'

export function randomJobs () {
  return request({
    url: '/api/random_jobs/',
    method: 'get'
  })
}

export function release () {
  return request({
    url: 'https://api.github.com/repos/ets666/ets666-tool/releases/latest',
    method: 'get'
  })
}
