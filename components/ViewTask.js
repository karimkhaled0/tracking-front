import React, { Fragment, useRef, useState } from 'react'
import {
  LocationMarkerIcon,
  ChatAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XIcon
} from '@heroicons/react/solid'
import DatePicker from "react-datepicker";
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router';

function ViewTask({ description, customerName, phoneNumber, address, category, tech, endDate, taskId }) {
  const [view, setView] = useState(false)
  const [modal, setModal] = useState(true)
  const [modal2, setModal2] = useState(false)
  const [open, setOpen] = useState(true)
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
    setModal(!modal)
  }
  return (
    <div>
      <button className='border shadow-md active:scale-95 transition transform ease-out 
      text-white py-2 px-3 bg-slate-500 cursor-pointer hover:opacity-80 mr-5' onClick={closeModal}>view Task</button>
      <div className={modal ? "fixed z-10 overflow-y-auto top-0 w-full left-0 hidden" : "fixed z-10 overflow-y-auto top-0 w-full left-0"}>
        <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75" />
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div className="inline-block align-center bg-gray-50 rounded-lg text-left shadow-xl transform 
          transition-all w-full h-screen sm:align-middle mt-16 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div className='grid grid-cols-2'>
              <div className='mx-10 my-7 space-y-5 '>
                <div className='flex justify-between items-center'>
                  <div className='flex space-x-2 items-center '>
                    <h1 className='text-4xl font-semibold'>#12345</h1>
                    <h1 className='text-lg text-gray-500'>(in progress)</h1>
                  </div>
                  <div>
                    <XIcon className='h-6 text-red-500 font-semibold cursor-pointer' onClick={closeModal} />
                  </div>
                </div>
                {/* Description */}
                <div className='space-y-2'>
                  <h1 className='text-xl font-semibold'>Description</h1>
                  <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                    <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-hide mr-5 text-xl text-gray-800 mx-5' title="Scroll down">
                      {description}
                    </div>
                  </div>
                </div>
                {/* customer and phone number */}
                <div className='flex justify-between space-x-16'>
                  {/* Customer */}
                  <div className='flex-grow space-y-2'>
                    <h1 className='text-xl font-semibold'>Customer name</h1>
                    <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                      <div className='flex mt-2 w-full h-12 mr-5 text-xl text-gray-800 mx-5'>
                        {customerName}
                      </div>
                    </div>
                  </div>
                  {/* Phone number */}
                  <div className='flex-grow space-y-2'>
                    <h1 className='text-xl font-semibold'>Phone number</h1>
                    <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                      <div className='flex mt-2 w-full h-12 mr-5 text-xl text-gray-800 mx-5'>
                        {phoneNumber}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Address */}
                <div className='space-y-2'>
                  <h1 className='text-xl font-semibold'>Address</h1>
                  <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                    <div className='flex mt-2 w-full h-10 mr-5 text-xl text-gray-800 mx-5'>
                      {address}
                    </div>
                  </div>
                </div>
                {/* Category / Assigned to / EndData */}
                <div className='flex justify-between space-x-16'>
                  {/* Category */}
                  <div className='flex-grow space-y-2'>
                    <h1 className='text-xl font-semibold'>Category</h1>
                    <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                      <div className='flex mt-2 w-full h-12 mr-5 text-xl text-gray-800 mx-5'>
                        {category}
                      </div>
                    </div>
                  </div>
                  {/* Assigned to */}
                  <div className='flex-grow space-y-2'>
                    <h1 className='text-xl font-semibold'>Technical</h1>
                    <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                      <div className='flex mt-2 w-full h-12 mr-5 text-xl text-gray-800 mx-5'>
                        {tech}
                      </div>
                    </div>
                  </div>
                  {/* End Date */}
                  <div className='flex-grow space-y-2'>
                    <h1 className='text-xl font-semibold'>Deadline</h1>
                    <div className='flex items-center space-x-2 bg-white shadow-md rounded-lg'>
                      <div className='flex mt-2 w-full h-12 mr-5 text-xl text-gray-800 mx-5'>
                        {endDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <button className='border shadow-md rounded-lg active:scale-95 transition transform ease-out 
               text-white py-2 px-5 bg-slate-500 cursor-pointer hover:opacity-80 mr-5' onClick={closeModal}>close</button>
                  <button className='border shadow-md active:scale-95 transition transform ease-out 
               text-white py-2 px-5 bg-red-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={closeModal2}>Delete</button>
                </div>

                {modal2 ? <Transition.Root show={open} as={Fragment}>
                  <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal2}>
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





              <div className='m-10'>
                <img src="/GoogleMapTA.jpg" alt="" className='w-5/6' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ViewTask