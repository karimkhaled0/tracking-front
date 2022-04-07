import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Tasks from './tasks'

const Home: NextPage = () => {
  const [headerViewd, setHeaderViewd] = useState(true)

  const router = useRouter()
  // useEffect(()=> {
  //   router.push({
  //     pathname: '/tasks'
  //   })
  // }, )

  // user checked
  const [user, setUser] = useState(false)
  const signinHandler = () => {
    router.push({
      pathname: '/signin',
    })
  }

  useEffect(() => {
    const useEffectError = async () => {
      const res = await fetch('http://localhost:8000/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((r) => r.json())
      const error = res.error
      if (error == 'Not Authorized') {
        localStorage.removeItem('token')
        router.push({
          pathname: '/signin',
        })
      } else {
        setUser(true)
        router.push({
          pathname: '/tasks',
        })
      }
    }
    useEffectError()
  }, [])

  return (
    <div>
      <Head>
        <title>Tracking information system</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header islogged={user} />

      <main className="">
        {user ? null : (
          <div className="mt-12 flex flex-col items-center">
            <div className="w-96">
              <img src="/Location review-amico.svg" alt="" />
            </div>
            <div className="mt-7">
              <div className="flex space-x-2">
                <h3
                  onClick={signinHandler}
                  className="cursor-pointer text-2xl font-semibold text-blue-500 hover:border-b hover:text-red-500"
                >
                  Sign in
                </h3>
                <h3 className="text-2xl font-semibold text-blue-500">
                  {' '}
                  to view tasks
                </h3>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
