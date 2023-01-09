import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { useQuery } from '@tanstack/react-query'
import { getUserData } from '../fetching/getUserData'
import { useRouter } from 'next/router'
import { socket } from '../socketConnection/socket'
import { getAllTechnicals } from '../fetching/getAllTechnicals'
import { getRooms } from '../fetching/getRooms'
import axios from 'axios'

function Messages() {
  var arr = []
  socket.on('connect', () => {
    arr.push(socket.id)
    console.log(arr)
  })

  socket.on('disconnect', () => {
    socket.disconnect()
    arr = []
    console.log(socket.id) // undefined
  })

  // TODO: Customer service chat (Admins&TeamLeaders are customer service) - (Technical is the customer)
  // TODO: the chat will have end (Delete) and start (Create)
  /* TODO: 
    let arr1 = [1,2,3]
    undefined
    let arr2 = [1,2,3,4,5,6]
    undefined
    arr2 = arr2.filter(val => !arr1.includes(val));
    (3) [4, 5, 6]
  */
  const divRef = useRef(null)
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'auto' })
  })
  const router = useRouter()
  const [user, setUser] = useState(false)
  const [chats, setChats] = useState(true)
  const [creatChat, setCreatChat] = useState(false)
  const [seconedMember, setSecondMember] = useState('')
  const [checkedName, setCheckedName] = useState('')
  const useQueryMultiple = () => {
    // Get user data
    const userData = useQuery(['userData'], getUserData, {
      staleTime: Infinity,
    })
    // Get All technicals
    const allTechnicals = useQuery(['allTechnicals'], getAllTechnicals, {
      staleTime: Infinity,
    })
    // Get Rooms
    const rooms = useQuery(['rooms'], getRooms, {
      staleTime: Infinity,
    })
    return [userData, allTechnicals, rooms]
  }
  const [
    // Get user data
    { isLoading: loading1, data: data1, isError: isError1 },
    // Get All technicals
    { isLoading: loading2, data: data2, isError: isError2 },
    // Get Rooms
    { isLoading: loading3, data: data3, isError: isError3 },
  ] = useQueryMultiple()
  useEffect(() => {
    if (isError3) return
    if (isError1)
      return router.push({
        pathname: '/',
      })
    setUser(true)
  }, [user, data1])

  const addChat = () => {
    setChats(!chats)
    setCreatChat(false)
    setCheckedName('')
  }

  const createRoom = async () => {
    const options = {
      method: 'POST',
      url: 'https://tracking-back.onrender.com/api/chat',
      headers: {
        authorization: `Bearer ${localStorage.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        name: 'First',
        members: [data1.data._id, seconedMember],
      },
    }

    const res = await axios.request(options).catch(function (error) {
      console.error(error)
      return error
    })
    return res.data
  }

  return (
    <div className="h-[90vh]">
      <Header islogged={user} />
      <div className="flex h-full flex-row text-gray-800">
        {/* Chats */}
        <div className=" flex w-96 flex-shrink-0 flex-row bg-gray-100 p-4">
          <div className="-mr-4 flex h-full w-full flex-col py-1 pl-4 pr-4">
            {/* Personal chat */}
            <div className="relative h-full">
              <div className="text-xs font-semibold uppercase text-gray-400">
                Personal
              </div>
              {/* Chats */}
              <div
                className={
                  chats
                    ? 'h-full overflow-y-scroll pt-2 scrollbar-none'
                    : 'hidden'
                }
              >
                <div className="-mx-4 flex h-full flex-col divide-y overflow-y-scroll scrollbar-none">
                  {data3?.rooms.map((item, i) => (
                    <div
                      key={item._id}
                      className="relative flex cursor-pointer flex-row items-center p-4"
                    >
                      <div className="absolute right-0 top-0 mr-4 mt-3 text-xs text-gray-500">
                        2 hours ago
                      </div>
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                        {item?.members[0]?._id === data1?.data?._id
                          ? item?.members[1]?.name[0]
                          : item?.members[0]?.name[0]}
                      </div>
                      <div className="ml-3 flex flex-grow flex-col">
                        <div className="text-sm font-medium">
                          {item?.members[0]?._id === data1?.data?._id
                            ? item?.members[1]?.name
                            : item?.members[0]?.name}
                        </div>
                        <div className="w-56 truncate text-xs">
                          {item.messages.map(() => {
                            return item.messages[item?.messages.length - 1]
                              .content
                          })}
                        </div>
                      </div>
                      <div className="ml-2 mb-1 flex-shrink-0 self-end">
                        <span
                          className={
                            item?.messages.length === 0
                              ? 'hidden'
                              : 'flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'
                          }
                        >
                          {item?.messages.length === 0
                            ? ''
                            : item?.messages.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* newChat */}
              <div
                className={
                  chats
                    ? 'hidden'
                    : 'h-full overflow-y-scroll pt-2 scrollbar-none'
                }
              >
                <div className="-mx-4 flex h-full cursor-pointer flex-col divide-y overflow-y-scroll scrollbar-none">
                  {data2?.data.map((item) => {
                    return (
                      <div
                        key={item._id}
                        onClick={(e) => {
                          setSecondMember(item._id)
                          setCreatChat(true)
                          setCheckedName(item.name)
                        }}
                        className="relative flex flex-row items-center p-4"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold text-pink-300">
                          {item.name[0]}
                        </div>
                        <div className="ml-3 flex flex-grow flex-col">
                          <div className="text-sm font-medium">{item.name}</div>
                        </div>
                        <h1>{checkedName === item.name ? '✔️' : ''}</h1>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Add button */}
              <div className={chats ? 'absolute top-0 right-0' : 'hidden'}>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm"
                  onClick={addChat}
                >
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
              {/* Create room */}
              <div
                className={creatChat ? 'absolute top-0 right-20' : 'hidden'}
                onClick={createRoom}
              >
                <button className="flex w-fit items-center justify-center rounded-full bg-blue-500 px-2 py-1 text-sm text-white shadow-sm">
                  Create Chat
                </button>
              </div>
              {/* Cancel */}
              <div
                className={chats ? 'hidden' : 'absolute top-0 right-0'}
                onClick={addChat}
              >
                <button className="flex w-fit items-center justify-center rounded-full bg-gray-500 px-2 py-1 text-sm text-white shadow-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Messenger */}
        <div className="flex h-full min-w-0 max-w-full flex-col bg-white px-4 py-1">
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
              <div className="grid w-[74vw] grid-cols-1 gap-y-2">
                {/* Reciver */}
                <div className="col-start-1 col-end-8 ml-5 rounded-lg p-3">
                  <div className="flex flex-row items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative ml-3 rounded-xl bg-white py-2 px-4 text-sm shadow">
                      <div>hi</div>
                    </div>
                  </div>
                </div>
                {/* Sender */}
                <div className="col-start-6 col-end-13 mr-5 rounded-lg p-3">
                  <div className="flex  flex-row-reverse items-center justify-start">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative mr-3 rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
                      <div>hi</div>
                      <div className="absolute bottom-0 right-0 -mb-5 mr-2 text-xs text-gray-500">
                        Seen
                      </div>
                    </div>
                  </div>
                </div>
                <div ref={divRef} />
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
