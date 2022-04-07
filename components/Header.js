import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    UserCircleIcon,
    BellIcon,
    ChevronDownIcon,
} from '@heroicons/react/solid'

function Header({ islogged }) {
    const router = useRouter();
    // Viewing profile modal
    const [view, setView] = useState(false);

    const [displayName, setDisplayName] = useState('')
    const [displayEmail, setDisplayEmail] = useState('')
    const [task, setTask] = useState(false)
    const [tech, setTech] = useState(false)
    const [rep, setRep] = useState(false)
    const [msg, setMsg] = useState(false)

    // Signout function
    const [signout, setSignout] = useState(false)

    const signoutHandler = () => {
        setSignout(true)
        localStorage.removeItem('token')
        router.push({
            pathname: '/signin'
        })
    }

    const viewHandler = () => {
        setView(!view)
    }



    // color of header handler
    if (router.pathname == "/tasks") {
        useEffect(() => {
            setTask(true)
            setTech(false)
            setRep(false)
            setMsg(false)
        }, [])
    }
    if (router.pathname == "/technicals") {
        useEffect(() => {
            setTask(false)
            setTech(true)
            setRep(false)
            setMsg(false)
        }, [])
    }
    if (router.pathname == "/teams") {
        useEffect(() => {
            setTask(false)
            setTech(false)
            setRep(true)
            setMsg(false)
        }, [])
    }
    if (router.pathname == "/messages") {
        useEffect(() => {
            setTask(false)
            setTech(false)
            setRep(false)
            setMsg(true)
        }, [])
    }



    // Router Handler
    const homeHandler = () => {
        router.push({
            pathname: '/'
        })

    }
    const taskHandler = () => {
        router.push({
            pathname: '/tasks'
        })

    }

    const techHandler = () => {
        router.push({
            pathname: '/technicals'
        })
    }

    const teamsHandler = () => {
        router.push({
            pathname: '/teams'
        })
    }

    const msgHandler = () => {
        router.push({
            pathname: '/messages'
        })
    }

    const signup = () => {
        router.push({
            pathname: '/signup'
        })
    }

    const signin = () => {
        router.push({
            pathname: '/signin'
        })
    }

    // fetch user data
    const profile = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json()).catch((e) => console.log(e))
        if (res.data) {
            if (res.data.counter == 0) {
                router.push({
                    pathname: '/changePass'
                })
            }
        } else {
            return
        }
        if (res.data) {
            setDisplayName(res.data.name)
            setDisplayEmail(res.data.email)
        } else {
            return
        }
    }, [displayEmail, displayName])

    return (
        <header className='sticky top-0 z-20 grid grid-cols-3 bg-white py-5 px-5 shadow-md md:px-10 items-center'>
            {/* Left Logo / name */}
            <div>
                <h3 className='h3' onClick={homeHandler}>Tracking information system</h3>
            </div>
            {/* Middle */}
            <div className='flex space-x-10'>
                <button className={task ? "h3 text-blue-500" : "h3 text-gray-500"} onClick={taskHandler}>Tasks</button>
                <button className={tech ? "h3 text-blue-500" : "h3 text-gray-500"} onClick={techHandler}>Technicals</button>
                <button className={rep ? "h3 text-blue-500" : "h3 text-gray-500"} onClick={teamsHandler}>Teams</button>
                <button className={msg ? "h3 text-blue-500" : "h3 text-gray-500"} onClick={msgHandler}>Messages</button>
            </div>
            {/* Right Login/signup */}
            {islogged ? (
                <div className='grid grid-row-3 relative'>
                    <div className='flex justify-end items-center space-x-3 '>
                        <UserCircleIcon onClick={viewHandler} className='h-6 cursor-pointer text-blue-500' />
                        <div className='flex items-center space-x-1 cursor-pointer'>
                            <button onClick={viewHandler}>{displayName}</button>
                            <ChevronDownIcon className='h-5 cursor-pointer' onClick={viewHandler} />
                        </div>
                        <BellIcon className="h-6 text-blue-500" />

                    </div>
                    <div className={view ? "absolute right-5 top-4 bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" : "hidden"} id="dropdown">
                        <div className="px-4 py-3">
                            <span className="block text-sm">{displayName}</span>
                            <span className="block text-sm font-medium text-gray-900 truncate">{displayEmail}</span>
                        </div>
                        <ul className="py-1" aria-labelledby="dropdown">
                            <li>
                                <a href={`/profile/${displayName}`} className="text-sm hover:bg-gray-100 text-gray-700 
                                block px-4 py-2">Profile</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:bg-gray-100 text-gray-700 
                                block px-4 py-2">Settings</a>
                            </li>
                            <li>
                                <a className="text-sm hover:bg-gray-100 text-gray-700 
                                block px-4 py-2 cursor-pointer" onClick={signoutHandler}>Sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                < div className='flex justify-end space-x-3 items-center'>
                    <button className='px-5 py-2 border rounded-full button text-blue-700' onClick={signup}>Sign Up</button>
                    <button className='px-5 py-2 border rounded-full button bg-blue-500 text-white' onClick={signin}>Sign in</button>
                </div>
            )}
        </header >
    )
}

export default Header