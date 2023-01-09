import axios from 'axios'

export const getUserData = async () => {
  const options = {
    method: 'GET',
    url: 'https://tracking-back.onrender.com/api/user/me',
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
