import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  LocationMarkerIcon,
  ChatAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XIcon
} from '@heroicons/react/solid'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


function ViewTask({ description, customerName, phoneNumber, address, category, tech, endDate, taskId }) {
  const [view, setView] = useState(false)
  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
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

  const closeModal2 = () => {
    setModal2(!modal2)
  }
  const closeModal = () => {
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
  return (
    <div>
      <button className='border shadow-md active:scale-95 transition transform ease-out 
      text-white py-2 px-3 bg-blue-500 cursor-pointer hover:opacity-80 mr-5 rounded-lg' onClick={closeModal}>Open</button>
      {modal ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed z-20 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal2}>
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
                          <h1 className='text-lg text-gray-500'>(in progress)</h1>
                        </div>
                        <div>
                          <XIcon className='h-7 text-red-500 font-semibold cursor-pointer' onClick={closeModal} />
                        </div>
                      </div>
                      {/* Description */}
                      <div className='space-y-2'>
                        <h1 className='text-xl text-gray-500 '>Description</h1>
                        <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                          <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-hide mr-5 text-xl text-gray-800 font-semibold mx-5' title="Scroll down">
                            {description}
                          </div>
                        </div>
                      </div>
                      {/* customer and phone number */}
                      <div className='flex justify-between space-x-16'>
                        {/* Customer */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl  text-gray-500'>Customer Name</h1>
                          <h1 className='text-xl font-semibold ml-2'> {customerName}</h1>
                        </div>
                        {/* Phone number */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl  text-gray-500'>Phone Number</h1>
                          <h1 className='text-xl font-semibold ml-2'> {phoneNumber}</h1>
                        </div>
                      </div>
                      {/* Address */}
                      <div className='space-y-2'>
                        <h1 className='text-xl  text-gray-500'>Address</h1>
                        <h1 className='text-xl font-semibold ml-2'> {address}</h1>
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
                          <h1 className='text-xl font-semibold ml-2'> {tech}</h1>

                        </div>
                        {/* End Date */}
                        <div className='flex-grow space-y-2'>
                          <h1 className='text-xl text-gray-500'>Deadline</h1>
                          <h1 className='text-xl font-semibold ml-2'>{endDate}</h1>
                        </div>
                      </div>
                      <div className='flex justify-between mt-20'>
                        <button className='border shadow-md rounded-lg active:scale-95 transition transform ease-out 
                    text-white py-2 px-5 bg-slate-500 cursor-pointer hover:opacity-80 mr-5' onClick={closeModal}>close</button>
                        <button className='border shadow-md active:scale-95 transition transform ease-out 
                    text-white py-2 px-5 bg-red-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={closeModal2}>Delete</button>
                      </div>
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
                    </div>
                    {/* Map */}
                    <div className='m-10'>
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

export default ViewTask