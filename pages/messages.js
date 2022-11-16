import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useQuery } from '@tanstack/react-query'
import { getUserData } from '../fetching/getUserData'
import { useRouter } from 'next/router'
function Messages() {
  // TODO: Customer service chat (Admins&TeamLeaders are customer service) - (Technical is the customer)
  // TODO: the chat will have end (Delete) and start (Create)
  const router = useRouter()
  const [user, setUser] = useState(false)
  // Get user data
  const { data, refetch, isError } = useQuery(['userData'], getUserData, {
    staleTime: Infinity,
  })
  useEffect(() => {
    if (!data)
      return router.push({
        pathname: '/',
      })
    setUser(true)
  }, [user, data])
  console.log(data)
  return (
    <div className="max-h-[650px]">
      <Header islogged={user} />
      <div className="flex h-[680px] flex-row text-gray-800">
        {/* Chats */}
        <div className="flex w-96 flex-shrink-0 flex-row bg-gray-100 p-4">
          <div className="-mr-4 flex h-full w-full flex-col py-4 pl-4 pr-4">
            {/* Messages head */}
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center">
                <div className="text-xl font-semibold">Messages</div>
                <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  5
                </div>
              </div>
              <div className="ml-auto">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <svg
                    className="h-4 w-4 stroke-current"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            {/* Options */}
            <div className="mt-5 ">
              <ul className="mx-auto flex flex-row items-center justify-between">
                <li>
                  <a
                    href="#"
                    className="relative flex items-center pb-3 text-xs font-semibold text-indigo-800"
                  >
                    <span>All Conversations</span>
                    <span className="absolute left-0 bottom-0 h-1 w-16 rounded-full bg-indigo-800"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center pb-3 text-xs font-semibold text-gray-700"
                  >
                    <span>Archived</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center pb-3 text-xs font-semibold text-gray-700"
                  >
                    <span>Starred</span>
                  </a>
                </li>
              </ul>
            </div>
            {/* Team chat */}
            <div>
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-gray-400">
                  Team
                </div>
              </div>
              <div className="mt-2">
                <div className="-mx-4 flex flex-col">
                  <div className="relative flex flex-row items-center p-4">
                    <div className="absolute right-0 top-0 mr-4 mt-3 text-xs text-gray-500">
                      5 min
                    </div>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="text-sm font-medium">Cuberto</div>
                      <div className="w-44 truncate text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Debitis, doloribus?
                      </div>
                    </div>
                    <div className="ml-2 mb-1 flex-shrink-0 self-end">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        5
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center border-l-2 border-red-500 bg-gradient-to-r from-red-100 to-transparent p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">UI Art Design</div>
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="w-40 truncate text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Debitis, doloribus?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Personal chat */}
            <div>
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-gray-400">
                  Personal
                </div>
              </div>
              <div className="relative h-72 overflow-y-scroll pt-2 scrollbar-none">
                <div className="-mx-4 flex h-full flex-col divide-y overflow-y-auto scrollbar-none">
                  <div className="relative flex flex-row items-center p-4">
                    <div className="absolute right-0 top-0 mr-4 mt-3 text-xs text-gray-500">
                      2 hours ago
                    </div>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="text-sm font-medium">Flo Steinle</div>
                      <div className="w-40 truncate text-xs">
                        Good after noon! how can i help you?
                      </div>
                    </div>
                    <div className="ml-2 mb-1 flex-shrink-0 self-end">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        3
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">Sarah D</div>
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="w-40 truncate text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Debitis, doloribus?
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">Sarah D</div>
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="w-40 truncate text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Debitis, doloribus?
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">Sarah D</div>
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="w-40 truncate text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Debitis, doloribus?
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                      T
                    </div>
                    <div className="ml-3 flex flex-grow flex-col">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">Sarah D</div>
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="w-40 truncate text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Debitis, doloribus?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 mr-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Messenger */}
        <div className="flex h-full w-full flex-col bg-white px-4 py-6">
          {/* head */}
          <div className="flex flex-row items-center rounded-2xl py-4 px-6 shadow">
            {/* Firt letter above */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-pink-100">
              T
            </div>
            <div className="ml-3 flex flex-col">
              {/* Name above */}
              <div className="text-sm font-semibold">UI Art Design</div>
              {/* Status */}
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="ml-auto">
              <ul className="flex flex-row items-center space-x-2">
                <li>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
                  >
                    <span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        stroke="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
                  >
                    <span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        stroke="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
                  >
                    <span>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Chat */}
          <div className="h-full overflow-x-hidden overflow-y-scroll py-4 scrollbar-none">
            <div className="h-full overflow-x-hidden overflow-y-scroll scrollbar-none">
              <div className="grid grid-cols-12 gap-y-2">
                {/* Reciver */}
                <div className="col-start-1 col-end-8 rounded-lg p-3">
                  <div className="flex flex-row items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative ml-3 rounded-xl bg-white py-2 px-4 text-sm shadow">
                      <div>Hey How are you today?</div>
                    </div>
                  </div>
                </div>
                {/* Reciver */}
                <div className="col-start-1 col-end-8 rounded-lg p-3">
                  <div className="flex flex-row items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative ml-3 rounded-xl bg-white py-2 px-4 text-sm shadow">
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Vel ipsa commodi illum saepe numquam maxime
                        asperiores voluptate sit, minima perspiciatis.
                      </div>
                    </div>
                  </div>
                </div>
                {/* Sender */}
                <div className="col-start-6 col-end-13 rounded-lg p-3">
                  <div className="flex flex-row-reverse items-center justify-start">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative mr-3 rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
                      <div>
                        Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                      </div>
                      <div className="absolute bottom-0 right-0 -mb-5 mr-2 text-xs text-gray-500">
                        Seen
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="flex flex-row items-center">
            <div className="flex h-12 w-full flex-row items-center rounded-3xl border px-2">
              <button className="ml-1 flex h-10 w-10 items-center justify-center text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  ></path>
                </svg>
              </button>
              <div className="w-full">
                <input
                  type="text"
                  className="flex h-10 w-full items-center border border-transparent text-sm focus:outline-none"
                  placeholder="Type your message...."
                />
              </div>
              <div className="flex flex-row">
                <button className="flex h-10 w-8 items-center justify-center text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
                <button className="ml-1 mr-2 flex h-10 w-8 items-center justify-center text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="ml-6">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-white hover:bg-gray-300">
                <svg
                  className="-mr-px h-5 w-5 rotate-90 transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
