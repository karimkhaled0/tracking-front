import React, { useEffect, useState, Fragment, useRef } from 'react'
import {
  LocationMarkerIcon,
  ChatAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XIcon,
  PlusCircleIcon,
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRange } from 'react-date-range'
import { format, parseISO } from 'date-fns'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

function CreateTask() {
  // Errors
  const [locationError, setLocationError] = useState(false)
  const [categoryError, setCategoryError] = useState(false)
  const [customerNameError, setCustomerNameError] = useState(false)
  const [phoneNumberError, setPhoneNumberError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [techError, setTechError] = useState(false)
  const [techTrackError, setTechTrackError] = useState(true)

  // Modal functions
  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)
  const [open, setOpen] = useState(true)
  const [open2, setOpen2] = useState(true)
  const [open3, setOpen3] = useState(true)
  const cancelButtonRef = useRef(null)

  // Loading animation for create button
  const [prog, setProg] = useState(false)
  // categories
  const [categoryRes, setCategoryRes] = useState([])
  // Select option
  const [categId, setCategId] = useState('')
  const [technical, setTechnical] = useState('')

  const [teamLeaderCategory, setTeamLeaderCategory] = useState()
  const [teamLeader, setTeamLeader] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((r) => r.json())
    if (res.data.isTeamLeader) {
      setTeamLeaderCategory(res.data.category)
      setTeamLeader(true)
    }
    if (res.data.isAdmin) {
      setAdmin(true)
    }
  }, [])

  // Next button
  const nextHandler = () => {
    setModal(false)
    setModal2(!modal2)
  }
  const closeModal1 = () => {
    setModal(!modal)
  }
  // Back button
  const closeModal2 = () => {
    setModal2(false)
    setModal(!modal)
  }
  // Procceed
  const proccedHandler = () => {
    setModal2(false)
    setModal3(!modal3)
  }

  // Review Modal
  const closeModal3 = () => {
    setModal3(false)
    setModal2(!modal)
  }

  //  Categories (GET)
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

  // Date selection
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate)
    setEndDate(ranges.selection.endDate)
  }
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }
  // Task body
  const [description, setDescription] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  // Create task function (POST)
  const createTask = async () => {
    try {
      const res = await fetch(`https://tracking-back.onrender.com/api/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify({
          location: address,
          customerName: customerName,
          customerPhonenumber: phoneNumber,
          category: categId,
          description,
          description,
          duration: '1d',
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          techId: technical,
          coordinates: {
            long: coord.lng,
            lat: coord.lat,
            zoom: 10,
          },
        }),
      }).then((t) => t.json())
      // Errors handler and valdiation
      if (!res.errors && !techTrackError) {
        setProg(!prog)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        if (res.errors?.location) {
          setModal(!modal)
          setLocationError(true)
        }
        if (res.errors?.category) {
          setModal2(!modal2)
          setCategoryError(true)
        }
        if (res.errors?.customerName) {
          setModal(!modal)
          setCustomerNameError(true)
        }
        if (res.errors?.phonenumber) {
          setModal(!modal)
          setPhoneNumberError(true)
        }
        if (res.errors?.description) {
          setModal(!modal)
          setDescriptionError(true)
        }
        if (techTrackError) {
          setModal2(!modal2)
          setTechError(true)
        }
      }
    } catch (error) {
      if (techTrackError) {
        setModal2(!modal2)
        setTechError(true)
      }
    }
  }
  // map Functions
  // save search
  const [mapSearchRes, setMapSearchRes] = useState([])
  // coordinates
  const [viewport, setViewport] = useState({
    longitude: '31.23944',
    latitude: '30.05611',
    zoom: 15,
  })

  // fetch from api
  const getCoordinates = useEffect(async () => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1Ijoia2FyaW1raGFsZWRlbG1hd2UiLCJhIjoiY2wxa3l4bDRjMDN6ZDNjb2JnbWpzbGVncSJ9.Hr7IeGn4060vCiHaeJH1Zw`,
      {
        method: 'GET',
      }
    ).then((t) => t.json())
    setMapSearchRes(res.features)
  }, [address])
  // coordinates for marker which will post to create task
  const [coord, setCoord] = useState({
    lng: '31.23944',
    lat: '30.05611',
    zoom: 15,
  })

  const getAddress = useEffect(async () => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coord.lng},${coord.lat}.json?access_token=pk.eyJ1Ijoia2FyaW1raGFsZWRlbG1hd2UiLCJhIjoiY2wxa3l4bDRjMDN6ZDNjb2JnbWpzbGVncSJ9.Hr7IeGn4060vCiHaeJH1Zw`,
      {
        method: 'GET',
      }
    ).then((t) => t.json())
    if ((res.query[0] && res.query[1]) == 'undefined') {
      setAddress('')
    } else {
      setAddress(res.features[0].place_name)
    }
  }, [coord])
  return (
    <div>
      <button
        className="button rounded-lg border bg-blue-500 px-5 py-2 text-white"
        onClick={closeModal1}
      >
        Create Task
      </button>
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
                <div className="relative inline-block transform overflow-hidden rounded-lg bg-gray-50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-4/5 sm:align-middle">
                  <div className="grid grid-cols-2">
                    <div>
                      {/* Change hieght */}
                      <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-16">
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
                              Create task
                            </Dialog.Title>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-between">
                          <div className="flex items-center space-x-2">
                            <h1 className="rounded-full border-2 border-blue-500 px-2 py-[.5px]">
                              1
                            </h1>
                            <h1 className="text-lg text-blue-500">
                              Task details
                            </h1>
                          </div>
                          <div className="mt-4 w-16 border-t border-gray-700 pt-2" />

                          <div className="flex items-center space-x-2">
                            <h1 className="rounded-full border-2 border-gray-500 px-2 py-[.5px]">
                              2
                            </h1>
                            <h1 className="text-lg text-gray-500">
                              Management
                            </h1>
                          </div>
                          <div className="mt-4 w-16 border-t border-gray-700 pt-2" />

                          <div className="flex items-center space-x-2">
                            <h1 className="rounded-full border-2 border-gray-500 px-2 py-[.5px]">
                              3
                            </h1>
                            <h1 className="text-lg text-gray-500">Review</h1>
                          </div>
                        </div>
                        {/* Description */}
                        <div className="mt-5">
                          <div className="flex items-center space-x-2">
                            <h1 className="text-lg font-semibold">
                              Description
                            </h1>
                            <ExclamationCircleIcon
                              className={
                                descriptionError ? 'h-5 text-red-500' : 'hidden'
                              }
                            />
                          </div>
                          <textarea
                            type="text"
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value)
                              // hide valdiation while typing
                              setDescriptionError(false)
                            }}
                            title="Scroll down"
                            className={
                              descriptionError
                                ? 'mt-2 mb-3 w-full rounded-lg border border-red-500 bg-white p-2 pl-3 text-lg shadow-md scrollbar-none'
                                : 'mt-2 mb-3 w-full rounded-lg bg-white p-2 pl-3 text-lg shadow-md scrollbar-none'
                            }
                            rows="3"
                            cols="50"
                          ></textarea>
                        </div>
                        {/* Customer name, phoneNumber */}
                        <div className="mt-5 grid grid-cols-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h1 className="text-lg font-semibold">
                                Customer name
                              </h1>
                              <ExclamationCircleIcon
                                className={
                                  customerNameError
                                    ? 'h-5 text-red-500'
                                    : 'hidden'
                                }
                              />
                            </div>
                            <input
                              autoComplete="chrome-off"
                              className={
                                customerNameError
                                  ? 'mt-2 rounded-lg border border-red-500 bg-white pb-1 pl-3 text-lg shadow-md'
                                  : 'mt-2 rounded-lg bg-white pb-1 pl-3 text-lg shadow-md'
                              }
                              value={customerName}
                              type="text"
                              onChange={(e) => {
                                setCustomerName(e.target.value)
                                // hide valdiation while typing
                                setCustomerNameError(false)
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h1 className="text-lg font-semibold">
                                Phone number
                              </h1>
                              <ExclamationCircleIcon
                                className={
                                  phoneNumberError
                                    ? 'h-5 text-red-500'
                                    : 'hidden'
                                }
                              />
                            </div>
                            <input
                              autoComplete="chrome-off"
                              className={
                                phoneNumberError
                                  ? 'mt-2 rounded-lg border border-red-500 bg-white pb-1 pl-3 text-lg shadow-md'
                                  : 'mt-2 rounded-lg bg-white pb-1 pl-3 text-lg shadow-md'
                              }
                              value={phoneNumber}
                              type="text"
                              onChange={(e) => {
                                setPhoneNumber(e.target.value)
                                // hide valdiation while typing
                                setPhoneNumberError(false)
                              }}
                            />
                          </div>
                        </div>
                        {/* Address */}
                        <div className="mt-5">
                          <div className="flex items-center space-x-2">
                            <h1 className="text-lg font-semibold">Address</h1>
                            <ExclamationCircleIcon
                              className={
                                locationError ? 'h-5 text-red-500' : 'hidden'
                              }
                            />
                          </div>
                          <input
                            autoComplete={['chrome-off', 'off']}
                            className={
                              locationError
                                ? 'mt-2 w-full rounded-lg border border-red-500 bg-white pb-1 pl-3 text-lg shadow-md'
                                : 'mt-2 w-full rounded-lg bg-white pb-1 pl-3 text-lg shadow-md'
                            }
                            value={address}
                            type="text"
                            onChange={(e) => {
                              setAddress(e.target.value)
                              // hide valdiation while typing
                              setLocationError(false)
                            }}
                          />
                          {/* Search location */}
                          <div className="flex flex-col items-start">
                            {mapSearchRes?.map((item) => {
                              if (address == '') {
                                return
                              } else {
                                return (
                                  <button
                                    className="button mb-1 rounded-md px-5 py-2 text-blue-700 
                                                            hover:scale-90"
                                    onClick={() => {
                                      setViewport({
                                        longitude: item.center[0],
                                        latitude: item.center[1],
                                        zoom: 9,
                                      })
                                    }}
                                  >
                                    {item.place_name}
                                  </button>
                                )
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Map */}
                    <div className="m-10">
                      <Map
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        mapboxAccessToken={process.env.mapbox_key}
                        {...viewport}
                        onDrag={(nextViewport) => setViewport(nextViewport)}
                        onDblClick={(nextViewport) =>
                          setCoord(nextViewport.lngLat)
                        }
                        onWheel={(nextViewport) => setViewport(nextViewport)}
                      >
                        <Marker
                          longitude={coord ? coord.lng : null}
                          latitude={coord ? coord.lat : null}
                          anchor="right"
                          color="#FF0000"
                        ></Marker>
                      </Map>
                      <h1 className="text-lg font-semibold text-red-800">
                        Double click to mark a location
                      </h1>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={nextHandler}
                    >
                      Next
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal1}
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
      )}
      {modal2 && (
        <Transition.Root show={open2} as={Fragment}>
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
                {/* change width */}
                <div className="relative inline-block transform overflow-hidden rounded-lg bg-gray-50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-4/5 sm:align-middle">
                  <div>
                    {/* Change hieght */}
                    <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-10">
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
                            Create task
                          </Dialog.Title>
                        </div>
                      </div>
                      <div className="mt-5 flex space-x-5">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-6 text-blue-500" />
                          <h1 className="text-lg text-blue-600">
                            Task details
                          </h1>
                        </div>
                        <div className="mt-4 w-16 border-t border-gray-700 pt-2" />

                        <div className="flex items-center space-x-2">
                          <h1 className="rounded-full border-2 border-blue-500 px-2 py-[.5px]">
                            2
                          </h1>
                          <h1 className="text-lg text-blue-500">Management</h1>
                        </div>
                        <div className="mt-4 w-16 border-t border-gray-700 pt-2" />

                        <div className="flex items-center space-x-2">
                          <h1 className="rounded-full border-2 border-gray-500 px-2 py-[.5px]">
                            3
                          </h1>
                          <h1 className="text-lg text-gray-500">Review</h1>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          {/* Category Select */}
                          <div>
                            <div className="mt-5 flex items-center space-x-2">
                              <h1 className="text-lg text-gray-500">Team</h1>
                              <ExclamationCircleIcon
                                className={
                                  categoryError ? 'h-5 text-red-500' : 'hidden'
                                }
                              />
                            </div>
                            <select
                              onChange={(e) => {
                                setCategId(e.target.value)
                                // hide valdiation while typing
                                setCategoryError(false)
                              }}
                              name=""
                              id=""
                              className="mt-2 mb-5 w-96 rounded-lg pb-2 text-lg shadow-md"
                            >
                              <option value="" selected disabled hidden>
                                Choose here
                              </option>
                              {categoryRes?.map((item) => {
                                if (
                                  item._id == teamLeaderCategory &&
                                  teamLeader
                                ) {
                                  return (
                                    <option value={item._id}>
                                      {item.name}
                                    </option>
                                  )
                                } else if (admin) {
                                  return (
                                    <option value={item._id}>
                                      {item.name}
                                    </option>
                                  )
                                }
                              })}
                            </select>
                          </div>
                          {/* Technical select */}
                          <div>
                            <div className="mt-5 flex items-center space-x-2">
                              <h1 className="text-lg text-gray-500">
                                Technical
                              </h1>
                              <ExclamationCircleIcon
                                className={
                                  techError ? 'h-5 text-red-500' : 'hidden'
                                }
                              />
                            </div>
                            <select
                              onChange={(e) => {
                                setTechnical(e.target.value)
                                // hide valdiation while typing
                                setTechError(false)
                                setTechTrackError(false)
                              }}
                              name=""
                              id=""
                              className="mt-2 mb-5 w-96 rounded-lg pb-2 text-lg shadow-md"
                            >
                              <option value="" selected disabled hidden>
                                Choose here
                              </option>
                              {categoryRes?.map((item) => {
                                if (item._id == categId) {
                                  return item.technicals?.map((i) => {
                                    return (
                                      <option value={i._id}>{i.name}</option>
                                    )
                                  })
                                }
                              })}
                            </select>
                          </div>
                        </div>
                        {/* Date pick */}
                        <div className="">
                          <h1 className="mt-5 text-lg text-gray-500">
                            Pick Start date and End date
                          </h1>
                          <DateRange
                            direction={'horizontal'}
                            dateDisplayFormat={'yyyy-MM-dd'}
                            months={2}
                            showDateDisplay={false}
                            className="mt-2 w-full rounded-lg"
                            ranges={[selectionRange]}
                            minDate={new Date()}
                            rangeColors={['#FD5B61']}
                            onChange={handleSelect}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={proccedHandler}
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Procced
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={closeModal2}
                        ref={cancelButtonRef}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      {modal3 && (
        <Transition.Root show={open3} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-30 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={setModal3}
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
                <div className="relative inline-block transform overflow-hidden rounded-lg bg-gray-50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-4/5 sm:align-middle">
                  <div className="grid grid-cols-2">
                    <div>
                      {/* Change hieght */}
                      <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-10">
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
                              Create task
                            </Dialog.Title>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-6 text-blue-500" />
                            <h1 className="text-lg text-blue-600">
                              Task details
                            </h1>
                          </div>
                          <div className="mt-4 w-16 border-t border-gray-700 pt-2" />

                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-6 text-blue-500" />
                            <h1 className="text-lg text-blue-500">
                              Management
                            </h1>
                          </div>
                          <div className="mt-4 w-16 border-t border-gray-700 pt-2" />

                          <div className="flex items-center space-x-2">
                            <h1 className="rounded-full border-2 border-blue-500 px-2 py-[.5px]">
                              3
                            </h1>
                            <h1 className="text-lg text-blue-500">Review</h1>
                          </div>
                        </div>
                        {/* Description */}
                        <h1 className="mt-5 text-lg text-gray-700">
                          Description
                        </h1>
                        <div
                          className="mt-2 flex h-28 w-full overflow-y-auto scrollbar-none"
                          title="Scroll down"
                        >
                          {description}
                        </div>
                        {/* Customer name & phone number */}
                        <div className="mt-5 grid grid-cols-2">
                          <div>
                            <h1 className="mt-5 text-lg text-gray-700">
                              Customer Name
                            </h1>
                            <h1 className="text-lg font-semibold">
                              {customerName}
                            </h1>
                          </div>
                          <div>
                            <h1 className="mt-5 text-lg text-gray-700">
                              Phone number
                            </h1>
                            <h1 className="text-lg font-semibold">
                              {phoneNumber}
                            </h1>
                          </div>
                        </div>
                        {/* Team and technical */}
                        <div className="mt-5 grid grid-cols-2">
                          <div>
                            <h1 className="mt-5 text-lg text-gray-700">Team</h1>
                            <h1 className="text-lg font-semibold">
                              {categoryRes?.map((item) => {
                                if (item._id == categId) {
                                  return item.name
                                }
                              })}
                            </h1>
                          </div>
                          <div>
                            <h1 className="mt-5 text-lg text-gray-700">
                              Technical
                            </h1>
                            <h1 className="text-lg font-semibold">
                              {categoryRes?.map((item) => {
                                return item.technicals?.map((i) => {
                                  if (i._id == technical) {
                                    return i.name
                                  }
                                })
                              })}
                            </h1>
                          </div>
                        </div>
                        {/* Start date and end Date */}
                        <div className="mt-5 grid grid-cols-2">
                          <div>
                            <h1 className="mt-5 text-lg text-gray-700">
                              Start date
                            </h1>
                            <h1 className="text-lg font-semibold">
                              {format(startDate, 'dd/MMMM/yyyy')}
                            </h1>
                          </div>
                          <div>
                            <h1 className="mt-5 text-lg text-gray-700">
                              End date
                            </h1>
                            <h1 className="text-lg font-semibold">
                              {format(endDate, 'dd/MMMM/yyyy')}
                            </h1>
                          </div>
                        </div>
                        <div>
                          <h1 className="mt-5 text-lg text-gray-700">
                            Address
                          </h1>
                          <h1 className="text-lg font-semibold">{address}</h1>
                        </div>
                      </div>
                    </div>
                    {/* Map */}
                    <div className="m-10">
                      <Map
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        mapboxAccessToken={process.env.mapbox_key}
                        {...viewport}
                        onDrag={(nextViewport) => setViewport(nextViewport)}
                        onWheel={(nextViewport) => setViewport(nextViewport)}
                      >
                        <Marker
                          longitude={coord ? coord.lng : null}
                          latitude={coord ? coord.lat : null}
                          anchor="right"
                          color="#FF0000"
                        ></Marker>
                      </Map>
                      <h1 className="text-lg font-semibold text-red-800">
                        Double click to mark a location
                      </h1>
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
                        onClick={createTask}
                      >
                        Create
                      </button>
                    )}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal3}
                      ref={cancelButtonRef}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </div>
  )
}

export default CreateTask
