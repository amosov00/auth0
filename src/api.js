import axios from "axios";

const $axios = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': 'AuthUser',
    'X-Org-Id': 'AuthOrg',
  },
  baseURL: 'https://test-unified.client-api.vyyer.id/api'
})

export function fetchScans(token, page) {
  return $axios.post('/v2/scans/get',{
    "Page": page,
    "PerPage": 10,
    "OrderBy": ["created_at 1"]
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  })
}
export function fetchIdentities(token, data) {
  return $axios.post('/v2/identities/get',{"IDs": data}, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  })
}





