import React, { Fragment, useRef, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useRouter } from 'next/router'
import {
  DotsHorizontalIcon,
  ExclamationCircleIcon,
  XIcon,
} from '@heroicons/react/solid'
import {
  PlusIcon,
  ExclamationIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline'
import { Dialog, Transition } from '@headlessui/react'

function Teams() {
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [open, setOpen] = useState(true)
  const [technicals, setTechnicals] = useState([])
  const [technicalsId, setTechnicalsId] = useState([])
  const [technicalsName, setTechnicalsName] = useState([])
  const [teamLeaderName, setTeamLeaderName] = useState([])
  const [teamLeaderId, setTeamLeaderId] = useState([])
  const [searchTech, setSearchTech] = useState('')
  const [searchTeamLeader, setSearchTeamLeader] = useState('')
  const [headerViewd, setHeaderViewd] = useState(true)
  const [categName, setCategName] = useState('')
  const [hi, setHi] = useState(false)
  const [prog, setProg] = useState(false)
  const [nameErrIcon, setNameErrIcon] = useState(false)
  const [nameErr, setNameErr] = useState('')

  const [teamLeaderError, setTeamLeaderError] = useState(false)
  const [teamLeaderErrorSyntax, setTeamLeaderErrorSyntax] = useState('')
  const closeModalHandler = () => {
    if (teamLeaderError) {
      setModal(false)
      setTeamLeaderErrorSyntax(
        "You can't perform to do this action, Ask your Admin"
      )
    } else {
      setModal(!modal)
    }
  }
  const cancelButtonRef = useRef(null)
  const [categoryRes, setCategoryRes] = useState([])
  const [user, setUser] = useState(false)
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
  }, [hi]) // hi is props for let category run again to fetch and add technicals

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

  // clear duplicate items in array
  // Technicals array
  var newArray = technicalsId.filter(function (elem, pos) {
    return technicalsId.indexOf(elem) == pos
  })

  // Team leader array
  var newArray2 = teamLeaderId.filter(function (elem, pos) {
    return teamLeaderId.indexOf(elem) == pos
  })

  // Create Category with technicals and team leader
  var categId
  const createCategory = async () => {
    const res = await fetch(`https://tracking-back.onrender.com/api/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        name: categName,
      }),
    }).then((t) => t.json())
    const error = res.errors
    if (error) {
      setNameErrIcon(true)
      setNameErr(error.name)
    } else {
      setHi(true) // props
      setProg(!prog)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }
  // Add technicals to the category created
  useEffect(() => {
    categoryRes?.map((i) => {
      if (i.name == categName) {
        return (categId = i._id)
      }
    })
    let allTechnicals = newArray.concat(newArray2)
    allTechnicals?.map(async (i) => {
      const res = await fetch(
        `https://tracking-back.onrender.com/api/user/${i}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify({
            category: categId,
          }),
        }
      ).then((t) => t.json())
    })
  }, [categoryRes])

  return (
    <div>
      <Header islogged={user} />
      {user ? (
        <main className="mx-[64px] my-[80px] grid grid-cols-4 gap-[80px] ">
          {/* Create Category */}
          <button
            onClick={closeModalHandler}
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
              <h1 className="text-xl text-gray-500">Create team</h1>
            </div>
          </button>
          {/* Fetch Categories */}
          {categoryRes?.map((i) => {
            return (
              <div
                onClick={() => {
                  if (teamLeaderError) {
                    if (teamLeaderCategory == i._id) {
                      router.push({
                        pathname: `/teams/${i.name.replace('/', '')}`,
                      })
                    } else {
                      return
                    }
                  } else {
                    router.push({
                      pathname: `/teams/${i.name.replace('/', '')}`,
                    })
                  }
                }}
                className="transform cursor-pointer space-y-8 rounded-md border bg-white p-5 shadow-lg transition duration-200 ease-out active:scale-90"
              >
                {/* Category name */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold text-blue-500">
                    {i.name.charAt(0).toUpperCase() + i.name.slice(1)}
                  </h1>
                </div>
                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-normal">Total Technicals</h1>
                    <h1 className="text-lg font-normal">
                      {i.technicals.length}
                    </h1>
                  </div>
                  <div className="flex justify-between">
                    <h1 className="text-lg font-normal">Available now</h1>
                    <h1 className="text-lg font-normal">5</h1>
                  </div>
                </div>
                {/* Tech's names */}
                <div className="text-gray-500">
                  <h1 className="text-xl">
                    {i.technicals.length > 3
                      ? `${
                          i.technicals[0].name.charAt(0).toUpperCase() +
                          i.technicals[0].name.slice(1)
                        }, 
                                    ${
                                      i.technicals[1].name
                                        .charAt(0)
                                        .toUpperCase() +
                                      i.technicals[1].name.slice(1)
                                    }, 
                                    ${
                                      i.technicals[2].name
                                        .charAt(0)
                                        .toUpperCase() +
                                      i.technicals[2].name.slice(1)
                                    }, 
                                    +${i.technicals.length - 3}`
                      : i.technicals?.map((ii) => {
                          return `${
                            ii.name.charAt(0).toUpperCase() + ii.name.slice(1)
                          }, `
                        })}
                  </h1>
                </div>
              </div>
            )
          })}
          {modal ? (
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
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-100 transition-opacity" />
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
                    <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
                      {/* Change hieght */}
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                        <div className="flex items-center">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                            <PlusCircleIcon
                              className="h-6 w-6 text-blue-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-xl font-semibold leading-6 text-gray-900"
                            >
                              Create Team
                            </Dialog.Title>
                          </div>
                        </div>
                        <div className="grid grid-cols-3">
                          <div className="mt-5 space-y-3">
                            <p className="text-lg font-semibold">Name</p>

                            <div className="w-[200px] rounded-md border-2 py-1  shadow-sm">
                              <input
                                value={categName}
                                onChange={(e) => setCategName(e.target.value)}
                                className="mx-2 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                                type="text"
                                placeholder={'Type the name of team'}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <ExclamationCircleIcon
                                className={
                                  nameErrIcon ? 'h-4 text-red-500' : 'hidden'
                                }
                              />
                              <h1 className="text-s font-extralight text-red-500">
                                {nameErr}
                              </h1>
                            </div>
                          </div>
                          <div className="mt-5 space-y-3">
                            <p className="text-lg font-semibold">Technical</p>
                            <div className="w-[200px] rounded-md border-2 py-1  shadow-sm ">
                              <input
                                className="mx-2  bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                                type="text"
                                placeholder={'Add technicals to team'}
                                onChange={(e) => setSearchTech(e.target.value)}
                              />
                              <div className="flex h-40 flex-col space-y-1 overflow-y-scroll scrollbar-none">
                                {technicals
                                  ?.filter((val) => {
                                    if (
                                      val.name
                                        .toLowerCase()
                                        .includes(searchTech.toLowerCase()) &&
                                      !val.isTeamLeader
                                    ) {
                                      return val
                                    }
                                  })
                                  ?.map((i) => {
                                    if (i.category == undefined) {
                                      return (
                                        <div className="flex flex-col items-center justify-evenly">
                                          <button
                                            className="button mb-1 rounded-md px-5 py-2 text-blue-700 
                                                                hover:scale-90"
                                            onClick={(e) => {
                                              setTechnicalsId((oldArray) => [
                                                ...oldArray,
                                                i._id,
                                              ])
                                              setTechnicalsName((oldArray) => [
                                                ...oldArray,
                                                i.name,
                                              ])
                                            }}
                                          >
                                            {i.name}
                                          </button>
                                          <h1 className="mb-1 text-xs text-gray-600">
                                            Technical
                                          </h1>
                                        </div>
                                      )
                                    } else {
                                      return
                                    }
                                  })}
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 space-y-3">
                            <p className="text-lg font-semibold">Team Leader</p>
                            <div className="w-[200px] rounded-md border-2 py-1  shadow-sm ">
                              <input
                                className="mx-2  bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                                type="text"
                                placeholder={'Add Team leader to team'}
                                onChange={(e) =>
                                  setSearchTeamLeader(e.target.value)
                                }
                              />
                              <div className="flex h-40 flex-col space-y-1 overflow-y-scroll scrollbar-none">
                                {technicals
                                  ?.filter((val) => {
                                    if (
                                      val.name
                                        .toLowerCase()
                                        .includes(
                                          searchTeamLeader.toLowerCase()
                                        ) &&
                                      val.isTeamLeader
                                    ) {
                                      return val
                                    }
                                  })
                                  ?.map((i) => {
                                    if (i.category == undefined) {
                                      return (
                                        <div className="flex flex-col items-center justify-evenly">
                                          <button
                                            className="button mb-1 rounded-md px-5 py-2 text-blue-700 
                                                        hover:scale-90"
                                            onClick={(e) => {
                                              setTeamLeaderId((oldArray) => [
                                                ...oldArray,
                                                i._id,
                                              ])
                                              setTeamLeaderName((oldArray) => [
                                                ...oldArray,
                                                i.name,
                                              ])
                                            }}
                                          >
                                            {i.name}
                                          </button>
                                          <h1 className="mb-1 text-xs text-red-600">
                                            Team leader
                                          </h1>
                                        </div>
                                      )
                                    } else {
                                      return
                                    }
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5">
                          <h1 className="h1">Technicals of the Team </h1>
                          <div
                            title="scroll down"
                            className="flex h-32 justify-between overflow-y-scroll border border-blue-200 
                                        px-5 py-1 scrollbar-none"
                          >
                            <div className="">
                              {technicals?.map((i) => {
                                let names
                                newArray?.map((ii) => {
                                  if (i._id == ii) {
                                    names = i.name
                                  }
                                })
                                return (
                                  <h1 className="text-gray-500">{names}</h1>
                                )
                              })}
                            </div>
                            <div>
                              {newArray?.map((i) => {
                                return (
                                  <XIcon
                                    onClick={() => {
                                      setTechnicalsId(
                                        newArray.filter((item) => item !== i)
                                      )
                                    }}
                                    className="h-6 cursor-pointer text-red-400"
                                  />
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="mt-5">
                          <h1 className="h1">Team Leader of the team</h1>
                          <div
                            className="flex justify-between overflow-y-scroll border border-blue-200 
                                        px-5 py-1 scrollbar-none"
                          >
                            <div className="">
                              {technicals?.map((i) => {
                                let names
                                newArray2?.map((ii) => {
                                  if (i._id == ii) {
                                    names = i.name
                                  }
                                })
                                return (
                                  <h1 className="text-gray-500">{names}</h1>
                                )
                              })}
                            </div>
                            <div>
                              {newArray2?.map((i) => {
                                return (
                                  <XIcon
                                    onClick={() => {
                                      setTeamLeaderId(
                                        newArray.filter((item) => item !== i)
                                      )
                                    }}
                                    className="h-6 cursor-pointer text-red-400"
                                  />
                                )
                              })}
                            </div>
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
                            onClick={createCategory}
                          >
                            Create
                          </button>
                        )}
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={closeModalHandler}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
          ) : null}
        </main>
      ) : null}
    </div>
  )
}

export default Teams

// if (i.technicals.length > 3) {

//
