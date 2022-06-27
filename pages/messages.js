import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import { ChevronDoubleRightIcon, PlusIcon, SearchIcon } from '@heroicons/react/solid'
import Avatar from 'react-avatar'
import ChatUsers from '../components/ChatUsers'
import ChatMessages from '../components/ChatMessages'
import { io } from "socket.io-client";
const socket = io("http://localhost:8000");
let allChat = []

function Messages() {
    const router = useRouter()

    const [user, setUser] = useState(false)
    const [allRooms, setAllRooms] = useState([])
    const [create, setCreate] = useState(false)
    const [technicals, setTechnicals] = useState([])
    const [seconedMember, setSeconedMember] = useState('')
    const [userData, setUserData] = useState([])
    const [searchTech, setSearchTech] = useState('')
    const [selected, setSelected] = useState(false)
    const [chatMessagesName, setChatMessagesName] = useState('')
    const [message, setMessage] = useState('')
    const [messagesByRoom, setMessagesByRoom] = useState([])
    const [roomId, setRoomId] = useState('')
    const [bob, setBob] = useState(false)
    const [lastMessage, setLastMessage] = useState('')
    socket.on("msg:get", (data) => {
        for (let index = 0; index < data.msg.messages.length; index++) {
            allChat[index] = data.msg.messages[index]
        }
        setBob(!bob)
        // setLastMessage()
        console.log(allChat[allChat.length - 1])
    });
    const sendMessage = () => {
        let data = {
            author: userData._id,
            content: message,
            roomId: roomId
        }
        socket.emit('msg:post', data)
        setMessage('')
    }

    // get technicals
    const getTechnicals = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/technicals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((t) => t.json()).catch((e) => {
            router.push({
                pathname: '/signin'
            })
            localStorage.removeItem('token')
        })
        setTechnicals(res.data)
    }, [])

    const loggedHandler = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json())
        const error = res.error
        if (error == 'Not Authorized') {
            localStorage.removeItem('token')
            router.push({
                pathname: '/signin'
            })
        } else {
            setUserData(res.data)
            setUser(true)
        }

    }, [])

    const createRoom = async () => {
        const res = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                name: 'First',
                members: [
                    userData._id,
                    seconedMember
                ],
            })
        }).then((t) => t.json())
        const ress = await fetch(`http://localhost:8000/api/user/${seconedMember}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                inRoom: true
            })
        }).then((t) => t.json())
        setCreate(!create)
    }

    const getRooms = useEffect(() => {
        const getRoom = async () => {
            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.token}`
                },
            }).then((t) => t.json())
            setAllRooms(res?.rooms)
        }
        getRoom()
    }, [!create])
    // const messageSend = useEffect(() => {
    //     const updateRoom = async () => {
    //         const res = await fetch('http://localhost:8000/api/chat/62b3d6b630c1f3377bdde51a', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': `Bearer ${localStorage.token}`
    //             },
    //             body: JSON.stringify({
    //                 messages: {
    //                     author: '62511b5ae1c7222e0364f3a2',
    //                     content: 'Hi Ahmed'
    //                 }
    //             })
    //         }).then((t) => t.json())
    //         console.log(res)
    //     }
    //     updateRoom()
    // }, [])
    return (
        <div>
            <Header islogged={user} />
            {/* Messanger  */}
            <main className='mx-10 grid grid-cols-3 space-x-5'>

                {/* People */}
                <section className='mt-5 border-2 border-gray-300 shadow-xl'>
                    {/* Search */}
                    <div className='bg-gray-100 py-1'>
                        <div className="flex justify-between my-5 items-center">
                            <div className='flex items-center rounded-lg py-1 border-2 shadow-md bg-white ml-4'>
                                <input
                                    className="bg-transparent pl-2 pr-20 text-sm text-gray-600 placeholder-gray-400 outline-none"
                                    type="text"
                                    placeholder={"Start your search"}
                                />
                                <SearchIcon
                                    className="h-8 cursor-pointer rounded-full bg-blue-600 p-2 text-white flex mx-3"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setCreate(!create)
                                }}
                                type="button"
                                className="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Create chat
                            </button>
                        </div>
                    </div>
                    {/* Technicals */}
                    <div className='h-[520px] overflow-scroll scrollbar-hide'>
                        {/* User */}
                        {
                            allRooms?.map((item) => {
                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => {
                                            allChat = []
                                            setRoomId(item._id)
                                            setChatMessagesName(item?.members[1].name)
                                            const data = {
                                                roomId: item._id
                                            }
                                            socket.emit('roomId', data)
                                            socket.on("msg:get", (data) => {
                                                for (let index = 0; index < data.msg.messages.length; index++) {
                                                    allChat[index] = data.msg.messages[index]
                                                }
                                                setBob(!bob)
                                            });
                                        }}
                                    >
                                        <ChatUsers
                                            key={item._id}
                                            name={item.members[1].name}
                                            lastMessage={item.lastMessage ? item.lastMessage : ''}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>



                {/* Chat */}
                <section className='mt-5 border-2 border-gray-300 shadow-xl col-span-2'>
                    {
                        create ? (
                            // Create Room
                            <div>
                                <div className='bg-gray-100 py-1'>
                                    <div className="flex justify-between my-5 items-center">
                                        <div className='flex items-center rounded-lg py-1 border-2 shadow-md bg-white ml-4'>
                                            <h1 className='ml-1'>to: </h1>
                                            <input
                                                className="bg-transparent pl-2 pr-80 text-sm text-gray-600 placeholder-gray-400 outline-none"
                                                type="text"
                                                placeholder={"Start your search"}
                                                onChange={(e) => setSearchTech(e.target.value)}
                                                value={searchTech}
                                            />
                                            <SearchIcon
                                                className="h-8 cursor-pointer rounded-full bg-blue-600 p-2 text-white flex mx-3"
                                            />
                                        </div>
                                        <div>
                                            <button
                                                onClick={createRoom}
                                                type="button"
                                                className={selected ? "mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm" : "mr-2justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm hidden"}
                                            >
                                                Start Chat
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCreate(!create)
                                                }}
                                                type="button"
                                                className="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {
                                    technicals.filter((val) => {
                                        if (val.name.toLowerCase().includes(searchTech.toLowerCase())) {
                                            return val
                                        }
                                    })?.map((item) => {
                                        if (!item.inRoom) {
                                            return (
                                                <button
                                                    onClick={() => {
                                                        setSelected(!selected)
                                                        setSeconedMember(item._id)

                                                    }}
                                                    className='border w-full rounded-md bg-white shadow-md p-5 space-y-8 cursor-pointer transform transition ease-out active:scale-90 duration-200'>
                                                    <div className='flex items-center space-x-8 justify-between'>
                                                        <h1 className='text-xl'>{item.name}</h1>
                                                        {
                                                            item.isTeamLeader ? (
                                                                <h1 className='text-blue-500'>Team Leader</h1>
                                                            ) : (
                                                                <h1 className='text-gray-500'>Technical</h1>
                                                            )

                                                        }
                                                    </div>
                                                </button>
                                            )
                                        }
                                    })
                                }

                            </div>
                        ) : (
                            // Show message
                            <div>
                                {/* User data */}
                                <div className='bg-gray-100 py-0.5'>
                                    {/* Data */}
                                    <div className="flex justify-between my-5 items-center mx-5">
                                        {/* Name and Photo */}
                                        <div className='flex items-center space-x-5'>
                                            <Avatar className='rounded-full' name={chatMessagesName[0]} size='60' />
                                            <h1 className='text-xl'>{chatMessagesName}</h1>
                                        </div>
                                        {/* Search & delete Chat*/}
                                        <div className='flex items-center space-x-5'>
                                            <SearchIcon
                                                className="h-10 cursor-pointer rounded-full bg-blue-600 p-2 text-white flex mx-3"
                                            />
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                Delete chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Chat Page */}
                                <div className='h-[520px] overflow-scroll scrollbar-hide grid grid-row-5'>
                                    {
                                        bob ? (
                                            allChat.map((item) => {
                                                if (item.author == userData._id) {
                                                    {/* Sender */ }
                                                    return (
                                                        <div className=' justify-self-end row-span-2'>
                                                            <div className='mx-10 my-7 space-y-2 flex items-start space-x-2 w-2/4'>
                                                                <div className='flex items-center space-x-2 bg-blue-300 shadow-lg rounded-lg'>
                                                                    <div className=' mt-2 w-full h-fit mr-5 text-xl text-gray-800 font-semibold mx-5 mb-2'>
                                                                        <h1 className='justify-self-end'>{item.content}</h1>
                                                                    </div>
                                                                </div>
                                                                <Avatar className='rounded-full' name={'K'} size='30' color='green' />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <div className='justify-self-end row-span-2'>
                                                            <div className='mx-10 my-7 space-y-2 flex items-start space-x-2 w-2/4'>
                                                                <Avatar className='rounded-full' name={chatMessagesName[0]} size='30' color='green' />
                                                                <div className='flex items-center space-x-2 bg-gray-100 shadow-lg rounded-lg'>
                                                                    <div className=' mt-2 w-full h-fit mr-5 text-xl text-gray-800 font-semibold mx-5 mb-2'>
                                                                        <h1>{item.content}</h1>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        ) : (
                                            allChat.map((item) => {
                                                if (item.author == userData._id) {
                                                    {/* Sender */ }
                                                    return (
                                                        <div className=' justify-self-end'>
                                                            <div className='mx-10 my-7 space-y-2 flex items-start space-x-2 w-2/4'>
                                                                <div className='flex items-center space-x-2 bg-blue-300 shadow-lg rounded-lg'>
                                                                    <div className=' mt-2 w-full h-fit mr-5 text-xl text-gray-800 font-semibold mx-5 mb-2'>
                                                                        <h1 className='justify-self-end'>{item.content}</h1>
                                                                    </div>
                                                                </div>
                                                                <Avatar className='rounded-full' name={'K'} size='30' color='green' />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <div className='mx-10 my-7 space-y-2 flex items-start space-x-2 justify-self-start w-2/4'>
                                                            <Avatar className='rounded-full' name={chatMessagesName[0]} size='30' color='green' />
                                                            <div className='flex items-center space-x-2 bg-gray-100 shadow-lg rounded-lg'>
                                                                <div className=' mt-2 w-full h-fit mr-5 text-xl text-gray-800 font-semibold mx-5 mb-2'>
                                                                    <h1>{item.content}</h1>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        )
                                    }


                                </div>
                                {/* KeyBoard */}
                                <div className='flex justify-between items-center bg-gray-100 w-full max-w-full' >
                                    <textarea value={message} onChange={(e) => {
                                        setMessage(e.target.value)
                                    }} type="text" className="border-none outline-none resize-none w-full shadow-md bg-white p-2 scrollbar-hide mt-2 mb-3 text-lg rounded-lg pl-3" rows="2" cols="20">

                                    </textarea>
                                    <ChevronDoubleRightIcon
                                        onClick={sendMessage}
                                        className="h-8 cursor-pointer rounded-full bg-blue-400 p-2 text-white flex mx-3"
                                    />
                                </div>
                            </div>
                        )
                    }
                </section>
            </main>

        </div>
    )
}

export default Messages