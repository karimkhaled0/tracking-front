import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import { ExclamationCircleIcon } from '@heroicons/react/solid'

function ChangePass() {
  const router = useRouter()
  const [user, setUser] = useState(false)
  const [userId, setUserId] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordStateError, setPasswordStateError] = useState('')

  const loggedHandler = useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((r) => r.json())
    setUserId(res.data._id)
    const error = res.error
    if (error == 'Not Authorized') {
      localStorage.removeItem('token')
      router.push({
        pathname: '/signin',
      })
    } else {
      setUser(true)
    }
  }, [])

  const changePassword = async () => {
    if (password1 == password2) {
      if (
        password1.length > 8 &&
        password1.length < 16 &&
        password2.length > 8 &&
        password2.length < 16
      ) {
        const res = await fetch(
          `https://tracking-back.onrender.com/api/user/changepassword`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.token}`,
            },
            body: JSON.stringify({
              password: password1,
            }),
          }
        ).then((r) => r.json())
        router.push({
          pathname: '/tasks',
        })
      } else {
        setPasswordStateError('Password must be between 8 and 16 characters')
        setPasswordError(true)
      }
    } else {
      setPasswordStateError('Passwords must match')
      setPasswordError(true)
    }
  }

  return (
    <div>
      <Header islogged={user} />
      <main className="max-w-10xl mx-auto grid grid-cols-2 px-8">
        <div>
          <img src="/resetPassword.svg" className="mt-10 w-5/6" alt="" />
        </div>
        <div className="mt-20 flex flex-col space-y-5 px-24 pt-28">
          <div>
            <h1 className="h1 text-2xl">Reset your password</h1>
          </div>
          <div className="">
            <h1 className="h1 ml-2">New password</h1>
            <input
              autoComplete="chrome-off"
              placeholder="Enter your new password"
              value={password1}
              className="mt-5 ml-2 w-72 border-b-2 pb-1 outline-none"
              type="password"
              onChange={(e) => {
                setPassword1(e.target.value)
              }}
            />
          </div>
          <div className="">
            <h1 className="h1 ml-2">Confirm new password</h1>
            <input
              autoComplete="chrome-off"
              placeholder="Enter your new password"
              value={password2}
              className="mt-5 ml-2 w-72 border-b-2 pb-1 outline-none"
              type="password"
              onChange={(e) => {
                setPassword2(e.target.value)
                setPasswordError(false)
              }}
            />
          </div>
          <div>
            <button
              className="button rounded-lg border bg-blue-500 px-5 py-2 text-white"
              onClick={changePassword}
            >
              Change password
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <ExclamationCircleIcon
              className={passwordError ? 'h-4 text-red-500' : 'hidden'}
            />
            <h1 className="text-lg text-red-500">{passwordStateError}</h1>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChangePass
