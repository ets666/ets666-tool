import request from '@/utils/request.js'

export function randomJobs () {
  return request({
    url: '/api/random_jobs/',
    method: 'get'
  })
}
