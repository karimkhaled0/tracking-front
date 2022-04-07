import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'

function ChangePass() {
    const [user, setUser] = useState(false)
    const router = useRouter()
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
    return (
        <div>
            <Header islogged={user} />
            <main className='mx-auto max-w-10xl px-8 grid grid-cols-2'>
                <div>
                    <img src="/resetPassword.svg" className='w-5/6 mt-10' alt="" />
                </div>
                <div className='flex flex-col space-y-5 pt-28 px-24 mt-20'>
                    <div>
                        <h1 className='h1 text-2xl'>Reset your password</h1>
                    </div>
                    <div className=''>
                        <h1 className='h1 ml-2'>New password</h1>
                        <input autoComplete="chrome-off" placeholder='Enter your new password' className='pb-1 w-72 outline-none border-b-2 mt-5 ml-2' type="password" />
                    </div>
                    <div className=''>
                        <h1 className='h1 ml-2'>Confirm new password</h1>
                        <input autoComplete="chrome-off" placeholder='Enter your new password' className='pb-1 w-72 outline-none border-b-2 mt-5 ml-2' type="password" />
                    </div>
                    <div>
                        <button className='px-5 py-2 border rounded-lg button bg-blue-500 text-white '>Change password</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ChangePass