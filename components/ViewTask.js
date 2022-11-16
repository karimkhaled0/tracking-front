import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  LocationMarkerIcon,
  ChatAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XIcon,
  PencilAltIcon,
  BadgeCheckIcon,
  RewindIcon
} from '@heroicons/react/solid'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Calendar } from 'react-date-range';
import { format, parseISO } from 'date-fns'


function ViewTask({ description, customerName, phoneNumber, address, category, tech, endDate, taskId, status, progress, review, finished, report }) {
  const [view, setView] = useState(false)
  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)
  const [modal4, setModal4] = useState(false)

  const [open, setOpen] = useState(true)
  const [headerViewd, setHeaderViewd] = useState(true)

  const router = useRouter()
  const cancelButtonRef = useRef(null)

  const deleteTask = async () => {
    const res = await fetch(`http://localhost:8000/api/task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.token}`
      },
    }).then((t) => t.json()).catch((e) => console.log(e))
    setModal(!modal)
    setModal2(!modal2)
    router.push({
      pathname: '/'
    })
  }
  const finishTask = async () => {
    const res = await fetch(`http://localhost:8000/api/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        finished: true,
        inReview: false
      })
    }).then((t) => t.json()).catch((e) => console.log(e))
    setModal(!modal)
    setModal2(!modal2)
    router.push({
      pathname: '/'
    })
  }
  const getBackToProgress = async () => {
    const res = await fetch(`http://localhost:8000/api/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        inProgress: true,
        inReview: false,
        started: false
      })
    }).then((t) => t.json()).catch((e) => console.log(e))
    router.push({
      pathname: '/'
    })
  }

  const closeModal2 = () => {
    setModal2(!modal2)
  }
  const closeModal3 = () => {
    setModal3(!modal3)
  }
  const closeModal4 = () => {
    setModal4(!modal4)
  }
  const closeModal = () => {
    setUpdateTask(false)
    setViewport({
      longitude: coordinate.long,
      latitude: coordinate.lat,
      zoom: coordinate.zoom
    })
    setModal(!modal)
    setHeaderViewd(!headerViewd)

  }

  // Get task
  const [coordinate, setCoordinate] = useState({})
  const getTask = useEffect(async () => {
    const res = await fetch(`http://localhost:8000/api/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.token}`
      },
    }).then((t) => t.json()).catch((e) => console.log(e))
    setCoordinate(res.task.coordinates)
  }, [customerName])


  const [viewport, setViewport] = useState({
    longitude: 31,
    latitude: 29,
    zoom: 10
  })

  const [updateTask, setUpdateTask] = useState(false)
  const [updatedDescription, setUpdatedDescription] = useState(description)
  const [updatedCustomerName, setUpdatedCustomerName] = useState(customerName)
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(phoneNumber)
  const [updatedAddress, setUpdatedAddress] = useState(address)
  const [updatedCategory, setUpdatedCategory] = useState()
  const [updatedTech, setUpdatedTech] = useState()
  const [updatedEndDate, setUpdatedEndDate] = useState(null)
  const [prog, setProg] = useState(false)

  // coordinates for marker which will post to create task
  const [coord, setCoord] = useState('')

  const getAddress = useEffect(async () => {
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coord.lng},${coord.lat}.json?access_token=pk.eyJ1Ijoia2FyaW1raGFsZWRlbG1hd2UiLCJhIjoiY2wxa3l4bDRjMDN6ZDNjb2JnbWpzbGVncSJ9.Hr7IeGn4060vCiHaeJH1Zw`, {
      method: 'GET',
    }).then((t) => t.json())
    if ((res.query[0] && res.query[1]) == 'undefined') {
      setUpdatedAddress(address)
    } else {
      setUpdatedAddress(res.features[0].place_name)
    }
  }, [coord])

  const [categoryRes, setCategoryRes] = useState([])
  //  Categories (GET)
  const getCategory = useEffect(async () => {
    const res = await fetch('http://localhost:8000/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.token}`
      },
    }).then((t) => t.json()).catch((e) => console.log(e))
    setCategoryRes(res.categories)
  }, [])



  const updateTaskHandler = () => {
    setUpdateTask(true)
    console.log(updatedCategory)
  }

  const updateTaskPut = async () => {
    const res = await fetch(`http://localhost:8000/api/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        description: updatedDescription,
        customerName: updatedCustomerName,
        customerPhonenumber: updatedPhoneNumber,
        location: updatedAddress,
        coordinates: {
          long: coord ? coord.lng : coordinate.long,
          lat: coord ? coord.lat : coordinate.lat,
          zoom: 10
        },
        category: updatedCategory,
        techId: updatedTech,
        endDate: updatedEndDate ? format(updatedEndDate, 'yyyy-MM-dd') : format(parseISO(endDate.split('T')[0]), 'yyyy-MM-dd')
      })
    }).then((t) => t.json()).catch((e) => console.log(e))
    const error = res.errors
    if (!error) {
      setProg(!prog)
      setTimeout(() => {
        window.location.reload()
      }, 2000);
    }
  }

  // Get Back to progress

  return (
    <div>
      <button className='border shadow-md active:scale-95 transition transform ease-out 
      text-white py-2 px-3 bg-blue-500 cursor-pointer hover:opacity-80 mr-5 rounded-lg' onClick={closeModal}>Open</button>
      {modal ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed z-20 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-4/5">
                  {/* Change hieght */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-1">
                    <div className="sm:flex sm:items-start">
                    </div>
                  </div>
                  {/* grid */}
                  <div className='grid grid-cols-2'>
                    <div className='mx-10 my-7 space-y-8 '>
                      <div className='flex justify-between items-center'>
                        <div className='flex space-x-2 items-center '>
                          <h1 className='text-4xl font-semibold'>#12345</h1>
                          <h1 className='text-lg text-gray-500'>({status})</h1>
                        </div>

                        {
                          progress ? (
                            <div className='flex space-x-2 items-center'>
                              <PencilAltIcon className='h-5 text-gray-500 font-semibold cursor-pointer' onClick={closeModal} />
                              <h1 className='text-xl text-gray-500 cursor-pointer' onClick={updateTaskHandler}>Edit task</h1>
                            </div>
                          ) : null
                        }
                      </div>
                      {/* Description */}
                      <div className='space-y-2'>
                        <h1 className='text-xl text-gray-500 '>Description</h1>

                        {
                          updateTask ? (
                            <textarea type="text" value={updatedDescription} onChange={(e) => {
                              setUpdatedDescription(e.target.value)
                            }} title="Scroll down" className="w-full shadow-md bg-white p-2 scrollbar-none mt-2 mb-3 text-lg rounded-lg pl-3" rows="3" cols="50"></textarea>
                          ) : (
                            <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                              <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-none mr-5 text-xl text-gray-800 font-semibold mx-5' title="Scroll down">
                                {description}
                              </div>
                            </div>
                          )
                        }

                      </div>
                      {/* customer and phone number */}
                      <div className='flex justify-between space-x-16'>
                        {/* Customer */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl  text-gray-500'>Customer Name</h1>
                          {
                            updateTask ? (
                              <input autoComplete="chrome-off" className='pb-1 text-lg bg-white rounded-lg pl-3 shadow-md mt-2' value={updatedCustomerName} type="text" onChange={(e) => {
                                setUpdatedCustomerName(e.target.value)
                              }} />
                            ) : (
                              <h1 className='text-xl font-semibold ml-2'> {customerName}</h1>
                            )
                          }
                        </div>
                        {/* Phone number */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl  text-gray-500'>Phone Number</h1>
                          {
                            updateTask ? (
                              <input autoComplete="chrome-off" className='pb-1 text-lg bg-white rounded-lg pl-3 shadow-md mt-2' value={updatedPhoneNumber} type="text" onChange={(e) => {
                                setUpdatedPhoneNumber(e.target.value)
                              }} />
                            ) : (
                              <h1 className='text-xl font-semibold ml-2'> {phoneNumber}</h1>
                            )
                          }
                        </div>
                      </div>
                      {/* Address */}
                      <div className='space-y-2'>
                        <h1 className='text-xl  text-gray-500'>Address</h1>
                        {
                          updateTask ? (
                            <input autoComplete="chrome-off" className='pb-1 text-lg bg-white rounded-lg pl-3 shadow-md mt-2  w-full' value={updatedAddress} type="text" onChange={(e) => {
                              setUpdatedAddress(e.target.value)
                            }} />
                          ) : (
                            <h1 className='text-xl font-semibold ml-2'> {address}</h1>
                          )
                        }
                      </div>
                      {/* Category / Assigned to / EndData */}
                      <div className='flex justify-between space-x-16'>
                        {/* Category */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl  text-gray-500'>Category</h1>
                          <h1 className='text-xl font-semibold ml-2'> {category}</h1>
                        </div>
                        {/* Assigned to */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl  text-gray-500'>Technical</h1>
                          {
                            updateTask ? (
                              <select onChange={(e) => {
                                setUpdatedTech(e.target.value)
                              }} name="" id="" className='mt-2 pb-2 rounded-lg text-lg mb-5 shadow-md w-40' >
                                <option value="" selected disabled hidden>Choose here</option>
                                {
                                  categoryRes?.map((item) => {
                                    if (item.name == category) {
                                      return item.technicals?.map((i) => {
                                        return <option value={i._id}>{i.name}</option>
                                      })
                                    }
                                  })
                                }
                              </select>
                            ) : (
                              <h1 className='text-xl font-semibold ml-2'> {tech}</h1>
                            )
                          }

                        </div>

                      </div>
                      {/* End Date */}
                      <div className='flex-grow space-y-2'>
                        <h1 className='text-xl text-gray-500'>Deadline</h1>

                        {
                          updateTask ? (
                            <Calendar
                              dateDisplayFormat={'yyyy-MM-dd'}
                              onChange={item => setUpdatedEndDate(item)}
                              date={updatedEndDate}
                            />
                          ) : (
                            <h1 className='text-xl font-semibold ml-2'> {format(parseISO(endDate.split('T')[0]), 'dd/MMMM/yyyy')}</h1>
                          )
                        }
                      </div>
                      {review ? (
                        <div className='flex mt-20 justify-around'>
                          <button className='border shadow-md rounded-lg active:scale-95 transition transform ease-out 
                        text-white py-2 px-5 bg-slate-500 cursor-pointer hover:opacity-80 mr-5 hidden' onClick={closeModal}>close</button>
                          {
                            updateTask ? (
                              prog ? (<button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                <h1 className='animate-spin'></h1>
                                Loading...
                              </button>) : (
                                <button className='border shadow-md active:scale-95 transition transform ease-out 
                        text-white py-2 px-5 bg-blue-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={updateTaskPut}>Update</button>
                              )
                            ) : (
                              <button className='border shadow-md active:scale-95 transition transform ease-out 
                        text-white py-2 px-5 bg-red-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={closeModal2}>Delete</button>
                            )
                          }

                          <button className='border shadow-md active:scale-95 transition transform ease-out 
text-white py-2 px-5 bg-green-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={closeModal4}>Back to Progress</button>
                          <button className='border shadow-md active:scale-95 transition transform ease-out 
                          text-white py-2 px-5 bg-blue-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={closeModal3}>Finish</button>

                        </div>
                      ) : (
                        <div className='flex mt-20'>
                          <button className='border shadow-md rounded-lg active:scale-95 transition transform ease-out 
                        text-white py-2 px-5 bg-slate-500 cursor-pointer hover:opacity-80 mr-5 hidden' onClick={closeModal}>close</button>
                          {
                            updateTask ? (
                              prog ? (<button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                <h1 className='animate-spin'></h1>
                                Loading...
                              </button>) : (
                                <button className='border shadow-md active:scale-95 transition transform ease-out 
                        text-white py-2 px-5 bg-blue-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={updateTaskPut}>Update</button>
                              )
                            ) : (
                              <button className='border shadow-md active:scale-95 transition transform ease-out 
                        text-white py-2 px-5 bg-red-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={closeModal2}>Delete</button>
                            )
                          }
                        </div>
                      )
                      }
                      {/* Delete Task Modal */}
                      {modal2 ? <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal2}>
                          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                      <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Delete Task
                                      </Dialog.Title>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          Are you sure you want to delete this task? it will be permanently removed.
                                          This action cannot be undone.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={deleteTask}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
                      </Transition.Root> : null}
                      {/* Finish Task Modal */}
                      {modal3 ? <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal3}>
                          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                      <BadgeCheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Finish Task
                                      </Dialog.Title>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          Are you sure you want to finish this task?
                                          This action cannot be undone.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={finishTask}
                                  >
                                    Finish
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={closeModal3}
                                    ref={cancelButtonRef}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </Transition.Child>
                          </div>
                        </Dialog>
                      </Transition.Root> : null}
                      {/* Get back to in progress Modal */}
                      {modal4 ? <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal4}>
                          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                      <RewindIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Get back Task to in Progress
                                      </Dialog.Title>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          Are you sure you want to back this task to in Progress ?
                                          This action cannot be undone, and you should edit the deadline if it is necessary.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={getBackToProgress}
                                  >
                                    Done
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={closeModal4}
                                    ref={cancelButtonRef}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </Transition.Child>
                          </div>
                        </Dialog>
                      </Transition.Root> : null}
                    </div>
                    {/* Map */}
                    {
                      progress ? (
                        <div className='m-10'>
                          {
                            updateTask ? (
                              <Map
                                mapStyle="mapbox://styles/mapbox/streets-v9"
                                mapboxAccessToken={process.env.mapbox_key}
                                onWheel={(nextViewport) => setViewport(nextViewport)}
                                onDblClick={(nextViewport) => setCoord(nextViewport.lngLat)}
                                {...viewport}
                              >
                                <Marker longitude={coord ? (coord.lng) : coordinate.long} latitude={coord ? (coord.lat) : coordinate.lat} anchor="right" color='#FF0000'>
                                </Marker>
                              </Map>
                            ) : (
                              <Map
                                mapStyle="mapbox://styles/mapbox/streets-v9"
                                mapboxAccessToken={process.env.mapbox_key}
                                onWheel={(nextViewport) => setViewport(nextViewport)}
                                {...viewport}
                              >
                                <Marker longitude={coordinate ? (coordinate.long) : null} latitude={coordinate ? (coordinate.lat) : null} anchor="right" color='#FF0000'>
                                </Marker>
                              </Map>
                            )
                          }
                        </div>
                      ) : null
                    }
                    {
                      review ? (
                        <div className='m-10'>
                          <div className='space-y-2'>
                            <h1 className='text-xl text-gray-500 '>Report</h1>
                            <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                              <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-none mr-5 text-xl text-gray-800 font-semibold mx-5' title="Scroll down">
                                {report}
                              </div>
                            </div>

                          </div>
                          <Map
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            mapboxAccessToken={process.env.mapbox_key}
                            onWheel={(nextViewport) => setViewport(nextViewport)}
                            {...viewport}
                          >
                            <Marker longitude={coordinate ? (coordinate.long) : null} latitude={coordinate ? (coordinate.lat) : null} anchor="right" color='#FF0000'>
                            </Marker>
                          </Map>
                        </div>
                      ) : null
                    }
                    {
                      finished ? (
                        <div className='m-10'>
                          <div className='space-y-2'>
                            <h1 className='text-xl text-gray-500 '>Report</h1>
                            <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                              <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-none mr-5 text-xl text-gray-800 font-semibold mx-5' title="Scroll down">
                                {report}
                              </div>
                            </div>

                          </div>
                          <Map
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            mapboxAccessToken={process.env.mapbox_key}
                            onWheel={(nextViewport) => setViewport(nextViewport)}
                            {...viewport}
                          >
                            <Marker longitude={coordinate ? (coordinate.long) : null} latitude={coordinate ? (coordinate.lat) : null} anchor="right" color='#FF0000'>
                            </Marker>
                          </Map>
                        </div>
                      ) : null
                    }
                  </div>
                </div>
              </Transition.Child>
            </div>

          </Dialog>
        </Transition.Root >
      ) : null
      }
    </div >
  )
}

export default ViewTask