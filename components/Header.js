import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  UserCircleIcon,
  BellIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid'

function Header({ islogged, techProfile = true, techTeam = true }) {
  const router = useRouter()
  // Viewing profile modal
  const [view, setView] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [displayEmail, setDisplayEmail] = useState('')
  const [task, setTask] = useState(false)
  const [tech, setTech] = useState(false)
  const [rep, setRep] = useState(false)
  const [msg, setMsg] = useState(false)

  // Signout function
  const [signout, setSignout] = useState(false)

  const signoutHandler = () => {
    setSignout(true)
    localStorage.removeItem('token')
    router.push({
      pathname: '/signin',
    })
  }

  const viewHandler = () => {
    setView(!view)
  }

  // color of header handler
  if (router.pathname == '/tasks') {
    useEffect(() => {
      setTask(true)
      setTech(false)
      setRep(false)
      setMsg(false)
    }, [])
  }
  if (router.pathname == '/technicals') {
    useEffect(() => {
      setTask(false)
      setTech(true)
      setRep(false)
      setMsg(false)
    }, [])
  }
  if (router.pathname == '/teams') {
    useEffect(() => {
      setTask(false)
      setTech(false)
      setRep(true)
      setMsg(false)
    }, [])
  }
  if (router.pathname == '/messages') {
    useEffect(() => {
      setTask(false)
      setTech(false)
      setRep(false)
      setMsg(true)
    }, [])
  }

  // Router Handler
  const homeHandler = () => {
    router.push({
      pathname: '/',
    })
  }
  const taskHandler = () => {
    router.push({
      pathname: '/tasks',
    })
  }

  const techHandler = () => {
    router.push({
      pathname: '/technicals',
    })
  }

  const teamsHandler = () => {
    router.push({
      pathname: '/teams',
    })
  }

  const msgHandler = () => {
    router.push({
      pathname: '/messages',
    })
  }

  const signin = () => {
    router.push({
      pathname: '/signin',
    })
  }

  // fetch user data
  const profile = useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((r) => r.json())
      .catch((e) => console.log(e))
    if (res?.data) {
      setDisplayName(res.data.name)
      setDisplayEmail(res.data.loginId)
      if (res.data.changePasswordCounter == 0) {
        router.push({
          pathname: '/changePass',
        })
      } else if (!res.data.isAdmin && !res.data.isTeamLeader) {
        if (techProfile || techTeam) {
          router.push({
            pathname: '/notAuthorized',
          })
        }
      }
    } else {
      return
    }
  }, [displayEmail, displayName])

  return (
    <header className="sticky top-0 z-20 grid grid-cols-3 items-center bg-white py-5 px-5 shadow-md md:px-10">
      {/* Left Logo / name */}
      <div>
        <h3 className="h3" onClick={homeHandler}>
          Tracking information system
        </h3>
      </div>
      {/* Middle */}
      {islogged ? (
        <div className="flex space-x-10">
          <button
            className={task ? 'h3 text-blue-500' : 'h3 text-gray-500'}
            onClick={taskHandler}
          >
            Tasks
          </button>
          <button
            className={tech ? 'h3 text-blue-500' : 'h3 text-gray-500'}
            onClick={techHandler}
          >
            Technicals
          </button>
          <button
            className={rep ? 'h3 text-blue-500' : 'h3 text-gray-500'}
            onClick={teamsHandler}
          >
            Teams
          </button>
          <button
            className={msg ? 'h3 text-blue-500' : 'h3 text-gray-500'}
            onClick={msgHandler}
          >
            Messages
          </button>
        </div>
      ) : null}
      {/* Right Login/signup */}
      {islogged ? (
        <div className="grid-row-3 relative grid">
          <div className="flex items-center justify-end space-x-3 ">
            <UserCircleIcon
              onClick={viewHandler}
              className="h-6 cursor-pointer text-blue-500"
            />
            <div className="flex cursor-pointer items-center space-x-1">
              <button onClick={viewHandler}>{displayName}</button>
              <ChevronDownIcon
                className="h-5 cursor-pointer"
                onClick={viewHandler}
              />
            </div>
            <BellIcon className="h-6 text-blue-500" />
          </div>
          <div
            className={
              view
                ? 'absolute right-5 top-4 z-50 my-4 list-none divide-y divide-gray-100 rounded bg-white text-base shadow'
                : 'hidden'
            }
            id="dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm">{displayName}</span>
              <span className="block truncate text-sm font-medium text-gray-900">
                {displayEmail}
              </span>
            </div>
            <ul className="py-1" aria-labelledby="dropdown">
              <li>
                <button
                  className="block px-4 py-2 
                                text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    router.push(`/profile/${displayName}`)
                  }}
                >
                  Profile
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 
                                text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  className="block cursor-pointer px-4 
                                py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={signoutHandler}
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="col-span-2 flex items-center justify-end space-x-3">
          <button
            className="button rounded-full border px-5 py-2 text-blue-700"
            onClick={signin}
          >
            Sign in
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
