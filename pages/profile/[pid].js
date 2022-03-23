import { ChatAltIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { PlusIcon, SearchIcon, PlusCircleIcon, XIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { Fragment, useRef, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import Avatar from 'react-avatar';
import Error from 'next/error'


const teams = () => {
    const router = useRouter()
    const { pid } = router.query
    const [user, setUser] = useState(false)
    const [headerViewd, setHeaderViewd] = useState(false)
    const [userId, setUserId] = useState('')
    const [userData, setUserData] = useState([])
    const [adminUserData, setAdminUserData] = useState([])
    const [categoryName, setCategoryName] = useState('')
    const [myProfile, setMyProfile] = useState(false)

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
            setUser(true)

        }

    }, [])

    // get technicals
    const [technicals, setTechnicals] = useState([])
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

    // Get technical id
    const getUserId = useEffect(async () => {
        technicals.map((i) => {
            if (i.name == pid.replace(/%20/g, " ")) {
                return setUserId(i._id)
            }
        })
    }, [technicals])

    // Get user Data
    const getUserData = useEffect(async () => {
        const res = await fetch(`http://localhost:8000/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            }

        }).then((t) => t.json())
        setUserData(res.data)
        if (res.data.category) {
            setCategoryName(res.data.category.name)
        }
        setMyProfile(false)
    }, [userId])

    // get Admin profile
    const profile = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json()).catch((e) => console.log(e))
        setAdminUserData(res.data)
        setMyProfile(true)
    }, [])

    console.log(adminUserData)



    return (
        <div className='relative'>
            <Header
                headerView={!headerViewd}
                islogged={user}
            />
            {myProfile ? (
                <section className='mx-auto px-8 max-w-7xl my-10'>
                    <div className='grid grid-cols-3'>
                        <div className='flex flex-col items-center border-r-2 h-[450px] mt-10'>
                            <div >
                                <Avatar className='rounded-full' name={adminUserData.name} size='100' />
                            </div>
                            <h1 className='text-xl font-semibold text-blue-600 mt-5'>{adminUserData.name}</h1>
                            <h1 className='text-gray-500 mt-2'>{categoryName}</h1>
                        </div>
                        <div className='col-span-2 ml-[100px] space-y-5'>
                            <h1 className='text-2xl font-semibold text-gray-600'>Details</h1>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Full name</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.name}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Email</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.email}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Phone Number</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.phonenumber}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Address</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.address}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className='mx-auto px-8 max-w-7xl my-10'>
                    <div className='grid grid-cols-3'>
                        <div className='flex flex-col items-center border-r-2 h-[450px] mt-10'>
                            <div >
                                <Avatar className='rounded-full' name={userData.name} size='100' />
                            </div>
                            <h1 className='text-xl font-semibold text-blue-600 mt-5'>{userData.name}</h1>
                            <h1 className='text-gray-500 mt-2'>{categoryName}</h1>
                            <div className='flex space-x-5 mt-20 ml-7'>
                                <div className='border-r-2 pr-5 space-y-5 items-center flex flex-col'>
                                    <h1 className='text-gray-500'>Tasks</h1>
                                    <h1 className='text-blue-500'>30</h1>
                                </div>
                                <div className='border-r-2 pr-5 space-y-5 items-center flex flex-col'>
                                    <h1 className='text-gray-500'>Completed</h1>
                                    <h1 className='text-blue-500'>30</h1>
                                </div>
                                <div className='space-y-5 items-center flex flex-col'>
                                    <h1 className='text-gray-500'>In review</h1>
                                    <h1 className='text-blue-500'>30</h1>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-2 ml-[100px] space-y-5'>
                            <h1 className='text-2xl font-semibold text-gray-600'>Details</h1>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Full name</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.name}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Email</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.email}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Phone Number</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.phonenumber}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Team</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{categoryName}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Address</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.address}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

        </div>
    )
}

export default teams