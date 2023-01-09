import React, { useState, useEffect, useRef, Fragment } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import {
  DotsHorizontalIcon,
  DotsVerticalIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  SearchIcon,
} from '@heroicons/react/solid'
import {
  LocationMarkerIcon,
  ChatAltIcon,
  DotsCircleHorizontalIcon,
} from '@heroicons/react/outline'
import Avatar from 'react-avatar'
import { Dialog, Transition } from '@headlessui/react'
import { io } from 'socket.io-client'

const socket = io('https://tracking-back.onrender.com')
socket.on('connect', (data) => {
  console.log('connected', data)
})

function Technicals() {
  const [location, setLocation] = useState()
  const router = useRouter()

  socket.on('location:send', (data) => {
    setLocation(data)
  })

  // Modal
  const [modal, setModal] = useState(false)
  const [open, setOpen] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [teamleader, setTeamleader] = useState(false)
  const [tech, setTech] = useState(true)

  const cancelButtonRef = useRef(null)
  const closeModal = () => {
    if (teamLeaderError) {
      setModal(false)
      setTeamLeaderErrorSyntax(
        "You can't perform to do this action, Ask your Admin"
      )
    } else {
      setModal(!modal)
    }
  }
  const adminHandler = () => {
    setAdmin(true)
    setTeamleader(false)
    setTech(false)
  }
  const teamLeaderHandler = () => {
    setAdmin(false)
    setTeamleader(true)
    setTech(false)
  }
  const techHandler = () => {
    setAdmin(false)
    setTeamleader(false)
    setTech(true)
  }

  const [searchTech, setSearchTech] = useState('')
  // user checked
  const [user, setUser] = useState(false)
  const [teamLeaderError, setTeamLeaderError] = useState(false)
  const [teamLeaderErrorSyntax, setTeamLeaderErrorSyntax] = useState('')
  const [teamLeaderCategory, setTeamLeaderCategory] = useState([])

  const loggedHandler = useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
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
    }
    if (res.data?.isTeamLeader) {
      setTeamLeaderError(true)
      setTeamLeaderCategory(res.data.category)
    }
  }, [])

  const [technicals, setTechnicals] = useState([])
  // get technicals
  const getTechnicals = useEffect(async () => {
    const res = await fetch(
      'https://tracking-back.onrender.com/api/user/technicals',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }
    )
      .then((t) => t.json())
      .catch((e) => {
        router.push({
          pathname: '/signin',
        })
        localStorage.removeItem('token')
      })
    setTechnicals(res.data)
  }, [])

  //  Categories (GET)
  const [categoryRes, setCategoryRes] = useState([])
  const getCategory = useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((t) => t.json())
      .catch((e) => console.log(e))
    setCategoryRes(res.categories)
  }, [])

  // create user functions
  const [name, setName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('12345678')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [prog, setProg] = useState(false)
  // Errors
  const [loginIdError, setLoginIdError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [nameStateError, setNameStateError] = useState('')
  const [loginIdStateError, setLoginIdStateError] = useState('')

  const signUp = async (e) => {
    e.preventDefault()
    const res = await fetch('https://tracking-back.onrender.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        loginId: loginId,
        password: password,
        password2: password,
        phonenumber: phoneNumber,
        address: address,
        isAdmin: admin,
        isTeamLeader: teamleader,
      }),
    }).then((t) => t.json())
    const error = res.errors
    console.log(error)
    if (!error) {
      setProg(!prog)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      if (error.name) {
        setNameError(true)
        setNameStateError(error.name)
      }
      if (error.loginId) {
        setLoginIdError(true)
        setLoginIdStateError(error.loginId)
      }
    }
  }
  return (
    <div className="relative">
      <Header headerView={true} islogged={user} />
      {user ? (
        <section className="max-w-10xl mx-auto px-8">
          {/* Search and button  */}
          <div className="my-10 flex items-center justify-between">
            <div className="flex items-center rounded-full border-2 py-1 shadow-md">
              <input
                className="mx-5 bg-transparent pl-2 text-sm text-gray-600 placeholder-gray-400 outline-none"
                type="text"
                placeholder={'Start your search'}
                onChange={(e) => setSearchTech(e.target.value)}
              />
              <SearchIcon className="mx-3 flex h-8 cursor-pointer rounded-full bg-blue-400 p-2 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5">
            <button
              onClick={closeModal}
              className={
                teamLeaderErrorSyntax
                  ? 'transform cursor-pointer space-y-8 rounded-md border border-red-500 bg-white p-5 shadow-md transition duration-200 ease-out active:scale-90'
                  : 'transform cursor-pointer space-y-8 rounded-md border bg-white p-5 shadow-md transition duration-200 ease-out active:scale-90'
              }
            >
              <div className="flex flex-col items-center space-y-8">
                <h1 className="text-red-500">{teamLeaderErrorSyntax}</h1>
                <div className="rounded-full border border-blue-500">
                  <PlusIcon className="m-3 h-16 p-2 text-center text-gray-500" />
                </div>
                <h1 className="text-xl text-gray-500">Add technical</h1>
              </div>
            </button>
            {technicals
              ?.filter((val) => {
                if (val.name.toLowerCase().includes(searchTech.toLowerCase())) {
                  return val
                }
              })
              ?.map((i) => {
                return (
                  <div>
                    <div className="relative space-y-8 rounded-lg border bg-white p-5 shadow-lg">
                      <div
                        className="lex flex transform cursor-pointer flex-col items-center space-y-5 transition duration-200 ease-out active:scale-90"
                        onClick={() => {
                          if (teamLeaderError) {
                            if (teamLeaderCategory == i.category) {
                              router.push({
                                pathname: `/profile/${i.name.replace('/', '')}`,
                              })
                            } else {
                              return
                            }
                          } else {
                            router.push({
                              pathname: `/profile/${i.name.replace('/', '')}`,
                            })
                          }
                        }}
                      >
                        {/* Avatar */}
                        <div className="">
                          <Avatar
                            className="rounded-full"
                            name={i.name}
                            size="60"
                          />
                        </div>
                        {/* Technical name */}
                        <div className="">
                          <h1 className="text-2xl font-semibold text-blue-500">
                            {i.name.charAt(0).toUpperCase() + i.name.slice(1)}
                          </h1>
                        </div>
                        {/* Technical title */}
                        <div className="">
                          <h1
                            className={
                              i.isTeamLeader
                                ? 'text--500 text-lg'
                                : 'text-gray-500'
                            }
                          >
                            {i.isTeamLeader ? 'Team leader' : 'Technical'}
                          </h1>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {false ? (
                          <div className="flex items-center space-x-2">
                            <input type="radio" disabled checked={true} />
                            <h1 className="font-semibold text-green-600">
                              Available
                            </h1>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <input type="radio" checked={false} disabled />
                            <h1 className="font-semibold text-red-600">
                              Unavailable
                            </h1>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <LocationMarkerIcon
                            onClick={() => {
                              router.push({
                                pathname: '/map',
                                query: location,
                              })
                            }}
                            className="h-5 cursor-pointer text-gray-500"
                          />
                          <ChatAltIcon className="h-5 cursor-pointer text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          {modal && (
            <Transition.Root show={open} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-30 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={setModal}
              >
                <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  {/* This element is to trick the browser into centering the modal contents. */}
                  <span
                    className="hidden sm:inline-block sm:h-screen sm:align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    {/* change width */}
                    <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-4/5 sm:align-middle">
                      <div>
                        {/* Change hieght */}
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-10">
                          <div className="flex items-center">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                              <PlusCircleIcon
                                className="h-6 w-6 text-green-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <Dialog.Title
                                as="h3"
                                className="text-xl font-semibold leading-6 text-gray-900"
                              >
                                Add Technical
                              </Dialog.Title>
                            </div>
                          </div>

                          <div className="grid grid-cols-2">
                            {/* Technical form */}
                            <div className="mt-5 space-y-5">
                              <div className="flex space-x-5">
                                <button
                                  onClick={adminHandler}
                                  className={
                                    admin
                                      ? 'button rounded-xl border bg-blue-500 px-5 py-2 text-white'
                                      : 'button rounded-xl border px-5  py-2 text-blue-700'
                                  }
                                >
                                  Admin
                                </button>
                                <button
                                  onClick={teamLeaderHandler}
                                  className={
                                    teamleader
                                      ? 'button rounded-xl border bg-blue-500 px-5 py-2 text-white'
                                      : 'button rounded-xl border px-5  py-2 text-blue-700'
                                  }
                                >
                                  Team leader
                                </button>
                                <button
                                  onClick={techHandler}
                                  className={
                                    tech
                                      ? 'button rounded-xl border bg-blue-500 px-5 py-2 text-white'
                                      : 'button rounded-xl border px-5  py-2 text-blue-700'
                                  }
                                >
                                  Technical
                                </button>
                              </div>
                              <div className="ml-5 space-y-5">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h1 className="text-xl text-gray-500">
                                      Technical name
                                    </h1>
                                    <ExclamationCircleIcon
                                      className={
                                        nameError
                                          ? 'h-4 text-red-500'
                                          : 'hidden'
                                      }
                                    />
                                    <h1 className="text-lg text-red-500">
                                      {nameStateError}
                                    </h1>
                                  </div>
                                  <input
                                    autoComplete="chrome-off"
                                    className={
                                      nameError
                                        ? 'mt-2  w-full border-b-2 border-red-500 pb-1 outline-none'
                                        : 'mt-2  w-full border-b-2 pb-1 outline-none'
                                    }
                                    value={name}
                                    type="text"
                                    onChange={(e) => {
                                      setName(e.target.value)
                                      setNameError(false)
                                      setNameStateError('')
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h1 className="text-xl text-gray-500">
                                      Login Id
                                    </h1>
                                    <ExclamationCircleIcon
                                      className={
                                        loginIdError
                                          ? 'h-4 text-red-500'
                                          : 'hidden'
                                      }
                                    />
                                    <h1 className="text-lg text-red-500">
                                      {loginIdStateError}
                                    </h1>
                                  </div>
                                  <input
                                    autoComplete="chrome-off"
                                    className={
                                      loginIdError
                                        ? 'mt-2  w-full border-b-2 border-red-500 pb-1 outline-none'
                                        : 'mt-2  w-full border-b-2 pb-1 outline-none'
                                    }
                                    value={loginId}
                                    type="text"
                                    onChange={(e) => {
                                      setLoginId(e.target.value)
                                      setLoginIdError(false)
                                      setLoginIdStateError('')
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h1 className="text-xl text-gray-500">
                                      Password
                                    </h1>
                                    <h1 className="text-blue-500">
                                      *(The password is default, User will
                                      change when he logged in)
                                    </h1>
                                  </div>
                                  <input
                                    disabled
                                    value={'12345678'}
                                    autoComplete="chrome-off"
                                    className="mt-2 w-full border-b-2 pb-1 outline-none"
                                    type="text"
                                    onChange={(e) => {
                                      setPassword(e.target.value)
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <h1 className="text-xl text-gray-500">
                                    Phone number
                                  </h1>
                                  <input
                                    autoComplete="chrome-off"
                                    className="mt-2  w-full border-b-2 pb-1 outline-none"
                                    value={phoneNumber}
                                    type="text"
                                    onChange={(e) => {
                                      setPhoneNumber(e.target.value)
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <h1 className="text-xl text-gray-500">
                                    Address
                                  </h1>
                                  <input
                                    autoComplete="chrome-off"
                                    className="mt-2  w-full border-b-2 pb-1 outline-none"
                                    value={address}
                                    type="text"
                                    onChange={(e) => {
                                      setAddress(e.target.value)
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* image */}
                            <div>
                              <img src="/signup.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          {prog ? (
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              <h1 className="animate-spin"></h1>
                              Loading...
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={signUp}
                            >
                              Create
                            </button>
                          )}
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={closeModal}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
          )}
        </section>
      ) : null}
    </div>
  )
}

export default Technicals
