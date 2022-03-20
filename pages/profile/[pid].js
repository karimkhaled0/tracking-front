import { ChatAltIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { PlusIcon, SearchIcon, PlusCircleIcon, XIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { Fragment, useRef, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import Avatar from 'react-avatar';

const teams = () => {
    const [user, setUser] = useState(false)
    const [headerViewd, setHeaderViewd] = useState(false)

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
    const router = useRouter()
    const { pid } = router.query
    return (
        <div className='relative'>
            <Header
                headerView={!headerViewd}
                islogged={user}
            />
            <section className='mx-auto max-w-10xl px-8'>
                <div className='text-center my-5'>
                    <button className='px-5 py-2 border rounded-md text-xl button text-blue-500'>{pid}</button>
                </div>
            </section>

        </div>
    )
}

export default teams