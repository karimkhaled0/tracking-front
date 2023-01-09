import { ChatAltIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import {
  PlusIcon,
  SearchIcon,
  PlusCircleIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { Fragment, useRef, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import Avatar from 'react-avatar'

const teams = () => {
  const router = useRouter()
  const { pid } = router.query
  const [user, setUser] = useState(false)
  const [categoryRes, setCategoryRes] = useState([])
  const [technicals, setTechnicals] = useState([])
  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [open, setOpen] = useState(true)
  const [headerViewd, setHeaderViewd] = useState(false)
  const [searchTech, setSearchTech] = useState('')
  const [technicalsId, setTechnicalsId] = useState([])
  const [prog, setProg] = useState(false)
  const [technicalsName, setTechnicalsName] = useState([])
  const [nameErrIcon, setNameErrIcon] = useState(false)
  const [nameErr, setNameErr] = useState('')
  const [deletedCategory, setDeletedCategory] = useState('')
  const closeModal2 = () => {
    setModal2(!modal2)
  }
  const cancelButtonRef = useRef(null)
  const [teamLeader, setTeamLeader] = useState(false)
  const [userData, setUserData] = useState()
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
      setUserData(res.data)
    }
    if (res.data?.isTeamLeader) {
      setTeamLeader(true)
    }
    if (!res.data?.isTeamLeader && !res.data?.isAdmin) {
      setTechnicalError(false)
    }
  }, [])
  const [technicalError, setTechnicalError] = useState(true)
  const [technicalErrorSyntax, setTechnicalErrorSyntax] = useState('')
  const closeModalHandler = () => {
    setModal(!modal)
    if (!technicalError) {
      setTechnicalErrorSyntax("You can't perform to do this action")
      setModal(false)
    }
  }

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
    res.categories.map((item) => {
      if (item.name.replace('/', '') === pid) {
        setDeletedCategory(item._id)
      }
    })
  }, [])
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
  var categId
  const addTechnicals = () => {
    categoryRes?.map((i) => {
      if (i.name == pid) {
        return (categId = i._id)
      }
    })
    newArray?.map(async (i) => {
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
      console.log(res)
    })

    if (newArray.length == 0) {
      setNameErrIcon(true)
      setNameErr('Must have at least one Technical')
    } else {
      setProg(!prog)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  const deleteTeam = async () => {
    const res = await fetch(
      `https://tracking-back.onrender.com/api/category/${deletedCategory}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }
    )
      .then((t) => t.json())
      .catch((e) => console.log(e))
    if (res.message == 'Category Deleted!') {
      router.push({
        pathname: '/teams',
      })
    }
  }
  return (
    <div className="relative">
      <Header
        headerView={!headerViewd}
        islogged={user}
        techTeam={false}
        techProfile={false}
      />
      <section className="max-w-10xl mx-auto px-8">
        <div className="my-5 text-center">
          <button className="button rounded-md border px-5 py-2 text-xl text-blue-500">
            {pid}
          </button>
        </div>
        <div className="my-5 text-right">
          <button
            className="button rounded-md border bg-red-500 px-5 py-2 text-sm text-white"
            onClick={closeModal2}
          >
            Delete This team
          </button>
        </div>
        <div className="my-10 flex items-center justify-between">
          <div className="flex items-center rounded-full border-2 py-1 shadow-sm">
            <input
              className="w-52 bg-transparent pl-5 text-sm text-gray-600 placeholder-gray-400 outline-none"
              type="text"
              placeholder={'Start your search'}
              onChange={(e) => setSearchTech(e.target.value)}
            />
            <SearchIcon className="mx-3 flex h-7 cursor-pointer rounded-full bg-blue-400 p-2 text-white" />
          </div>
        </div>
      </section>
      <main className="mx-[64px] my-[80px] grid grid-cols-4 gap-[80px] ">
        {/* Create Category */}
        <button
          onClick={closeModalHandler}
          className={
            technicalErrorSyntax
              ? 'transform cursor-pointer space-y-8 rounded-md border border-red-500 bg-white p-5 shadow-md transition duration-200 ease-out active:scale-90'
              : 'transform cursor-pointer space-y-8 rounded-md border bg-white p-5 shadow-md transition duration-200 ease-out active:scale-90'
          }
        >
          <h1 className="text-red-500">{technicalErrorSyntax}</h1>
          <div className="flex flex-col items-center space-y-8">
            <div className="rounded-full border border-blue-500">
              <PlusIcon className="m-3 h-16 p-2 text-center text-gray-500" />
            </div>
            <h1 className="text-xl text-gray-500">Add technical</h1>
          </div>
        </button>
        {/* Fetch Categories */}
        {categoryRes?.map((i) => {
          if (i.name.replace('/', '') == pid) {
            return technicals
              .filter((val) => {
                if (val.name.toLowerCase().includes(searchTech.toLowerCase())) {
                  return val
                }
              })
              ?.map((ii) => {
                if (i._id == ii.category) {
                  return (
                    <div className="space-y-8 rounded-md border bg-white p-5 shadow-lg">
                      <div
                        className="flex transform cursor-pointer flex-col items-center space-y-5 transition duration-200  ease-out active:scale-90"
                        onClick={() => {
                          if (ii._id == userData._id) {
                            router.push({
                              pathname: `/profile/${ii.name.replace('/', '')}`,
                            })
                          } else if (
                            userData.isTeamLeader ||
                            userData.isAdmin
                          ) {
                            router.push({
                              pathname: `/profile/${ii.name.replace('/', '')}`,
                            })
                          }
                        }}
                      >
                        {/* Avatar */}
                        <div className="">
                          <Avatar
                            className="rounded-full"
                            name={ii.name}
                            size="60"
                          />
                        </div>
                        {/* Technical name */}
                        <div className="">
                          <h1 className="text-2xl font-semibold text-blue-500">
                            {ii.name.charAt(0).toUpperCase() + ii.name.slice(1)}
                          </h1>
                        </div>
                        {/* Technical title */}
                        <div className="">
                          <h1 className="text-gray-500">
                            {ii.isTeamLeader ? 'Team leader' : 'Technical'}
                          </h1>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input type="radio" disabled checked />
                          <h1 className="text-gray-600">Available</h1>
                        </div>
                        <div className="mr-5 flex space-x-2">
                          <LocationMarkerIcon className="h-5 cursor-pointer text-gray-500" />
                          <ChatAltIcon className="h-5 cursor-pointer text-gray-500" />
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return
                }
              })
          } else {
            return
          }
        })}
      </main>
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
                    <div className="">
                      <div className="mt-5 flex flex-col items-center space-y-3">
                        <p className="text-lg font-semibold">Technical</p>
                        <div className="w-[300px] rounded-md border-2 py-1  shadow-sm ">
                          <input
                            className="mx-2 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                            type="text"
                            placeholder={'Search here'}
                            onChange={(e) => setSearchTech(e.target.value)}
                          />
                          <div className="flex h-40 flex-col space-y-1 overflow-y-scroll scrollbar-none">
                            {teamLeader
                              ? technicals
                                  .filter((val) => {
                                    if (
                                      val.name
                                        .toLowerCase()
                                        .includes(searchTech.toLowerCase()) &&
                                      val.category == undefined &&
                                      !val.isTeamLeader
                                    ) {
                                      return val
                                    }
                                  })
                                  ?.map((i) => {
                                    return (
                                      <div className="flex flex-col items-center justify-center">
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
                                        <div className="flex items-center space-x-2">
                                          <h1 className="mb-1 text-xs text-gray-600">
                                            Not in team
                                          </h1>
                                          <h1 className="mb-1 text-xs text-gray-600">
                                            Technical
                                          </h1>
                                        </div>
                                      </div>
                                    )
                                  })
                              : technicals
                                  .filter((val) => {
                                    if (
                                      val.name
                                        .toLowerCase()
                                        .includes(searchTech.toLowerCase())
                                    ) {
                                      return val
                                    }
                                  })
                                  ?.map((i) => {
                                    return (
                                      <div className="flex flex-col items-center justify-evenly">
                                        <button
                                          className="button mb-1 rounded-md px-5 py-2 text-blue-700 hover:scale-90"
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
                                        {categoryRes?.map((item) => {
                                          if (item._id == i.category) {
                                            return (
                                              <div className="flex items-center space-x-2">
                                                <h1 className="mb-1 text-xs text-red-600">
                                                  {item.name}
                                                </h1>
                                                <h1
                                                  className={
                                                    i.isTeamLeader
                                                      ? 'mb-1 text-xs text-red-600'
                                                      : 'mb-1 text-xs text-gray-600'
                                                  }
                                                >
                                                  {i.isTeamLeader
                                                    ? 'Team leader'
                                                    : 'Technical'}
                                                </h1>
                                              </div>
                                            )
                                          }
                                        })}
                                        {i.category == undefined ? (
                                          <div className="flex items-center space-x-2">
                                            <h1 className="mb-1 text-xs text-gray-600">
                                              Not in team
                                            </h1>
                                            <h1
                                              className={
                                                i.isTeamLeader
                                                  ? 'mb-1 text-xs text-red-600'
                                                  : 'mb-1 text-xs text-gray-600'
                                              }
                                            >
                                              {i.isTeamLeader
                                                ? 'Team leader'
                                                : 'Technical'}
                                            </h1>
                                          </div>
                                        ) : null}
                                      </div>
                                    )
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
                            return <h1 className="text-gray-500">{names}</h1>
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
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {prog ? (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-blue-600 shadow-sm sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        <h1 className="animate-spin"></h1>
                        Loading...
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={addTechnicals}
                      >
                        Add
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
      {modal2 ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-30 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={setModal2}
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
                <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationCircleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Delete The Team
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-red-500">
                            Are you sure you want to delete this team ? This
                            action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={deleteTeam}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal2}
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
    </div>
  )
}

export default teams
