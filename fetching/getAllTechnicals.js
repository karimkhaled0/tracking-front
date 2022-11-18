import axios from 'axios'

export const getAllTechnicals = async () => {
  const options = {
    method: 'GET',
    url: 'http://localhost:8000/api/user/technicals',
    headers: {
      authorization: `Bearer ${localStorage.token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {},
  }

  const res = await axios.request(options).catch(function (error) {
    console.error(error)
    return error
  })
  return res.data
}
