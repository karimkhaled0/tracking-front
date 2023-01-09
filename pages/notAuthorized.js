import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'

function NotAuthorized() {
  const router = useRouter()
  const [noTeam, setNoTeam] = useState('')
  const goBackToTeam = async () => {
    // if user not in team throw error (ll)
    const userRes = await fetch(
      'https://tracking-back.onrender.com/api/user/me',
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }
    )
      .then((r) => r.json())
      .catch((e) => console.log(e))
    const categRes = await fetch(
      `https://tracking-back.onrender.com/api/category/${userRes.data.category}`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }
    )
      .then((r) => r.json())
      .catch((e) => console.log(e))

    if (userRes.data.category) {
      router.push({
        pathname: `/teams/${categRes.category.name}`,
      })
    } else {
      setNoTeam('You are not in team, Ask your team leader')
    }
  }

  const signoutHandler = () => {
    localStorage.removeItem('token')
    router.push({
      pathname: '/signin',
    })
  }

  // fetch user data
  const profileHandler = async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((r) => r.json())
      .catch((e) => console.log(e))
    router.push({
      pathname: `/profile/${res.data.name.replace('/', '')}`,
    })
  }
  return (
    <div>
      <div className="absolute z-0 flex h-screen w-screen flex-wrap content-center items-center justify-center">
        <h2 className="mb-96 text-xl font-black uppercase lg:text-7xl">
          Erorr 404
        </h2>
      </div>
      <div className="relative z-10 flex h-screen w-screen flex-wrap content-end items-end justify-center md:content-center md:items-center">
        <div className="space-x-10 p-6 text-center">
          <h2 className="text-xl font-black uppercase lg:text-5xl">
            We're sorry, but your not authorized to access this page.
          </h2>
          <button
            className="button mt-16 rounded-full border bg-gradient-to-r from-red-400 to-yellow-500 px-7 py-4 text-xl font-black"
            onClick={goBackToTeam}
          >
            My team
          </button>
          <button
            className="button mt-16 rounded-full border bg-gradient-to-r from-red-400 to-yellow-500 px-7 py-4 text-xl font-black"
            onClick={profileHandler}
          >
            My profile
          </button>
          <button
            className="button mt-16 rounded-full border bg-gradient-to-r from-red-400 to-yellow-500 px-7 py-4 text-xl font-black"
            onClick={signoutHandler}
          >
            Log out
          </button>
        </div>
        <h2 class="text-xl font-black uppercase text-red-800 lg:text-xl">
          {noTeam}
        </h2>
      </div>
    </div>
  )
}

export default NotAuthorized
