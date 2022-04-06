import React, { useEffect } from 'react'
import { useState } from 'react'
import Header from '../components/Header'
import Jwt from 'jsonwebtoken'
import { useRouter } from 'next/router';
import { ExclamationCircleIcon } from '@heroicons/react/solid';


function Signin() {
    const [loginId, setloginId] = useState('');
    const [password, setPassword] = useState('');
    const [remembered, setRemembered] = useState(false)
    const [user, setUser] = useState(false)
    const [error, setError] = useState("")

    // handle errors
    const [loginIdErr, setloginIdErr] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [loginIdErrIcon, setloginIdErrIcon] = useState(false)
    const [passwordErrIcon, setPasswordErrIcon] = useState(false)
    const [headerViewd, setHeaderViewd] = useState(true)

    const rememberHandler = () => {
        setRemembered(!remembered)
    }

    const router = useRouter()
    // sign in form
    const submitForm = async (e) => {
        setloginIdErr('')
        setPasswordErr('')
        setloginIdErrIcon(false)
        setPasswordErrIcon(false)
        e.preventDefault()
        const res = await fetch('http://localhost:8000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`
            },
            body: JSON.stringify({
                loginId,
                password
            })

        }).then((t) => t.json())

        const token = res.token

        if (token) {
            const json = Jwt.decode(token)
            localStorage.setItem('token', token)
            router.push({
                pathname: '/tasks'
            })
            setUser(true)
        } else {
            setError(res.message)
        }

        const error = res.errors
        if (!error) {
            router.push({
                pathname: '/tasks'
            })
            return
        } else {
            if (error.loginId) {
                setloginIdErr(error.loginId)
                setloginIdErrIcon(true)
            }
            if (error.password) {
                setPasswordErr(error.password)
                setPasswordErrIcon(true)
            }
        }
    }
    return (
        <div>
            <Header
                islogged={user}
                headerView={headerViewd}
            />
            <main className='mx-auto max-w-10xl px-8 grid grid-cols-2'>
                <div>
                    <img src="/Login-amico.svg" alt="" className='w-5/6 mt-16' />
                </div>
                <div className='flex pt-28 px-24'>
                    <form onSubmit={submitForm} method='POST' className='flex flex-col space-y-5'>
                        <h1 className='h1 text-2xl'>Sign in</h1>
                        <h1 className='text-lg pr-20'>Welcome! Please login to your account</h1>
                        <h1 className='h1'>loginId</h1>
                        <input type="loginId" className='input' value={loginId} placeholder='Enter your loginId' name={loginId} onChange={e => setloginId(e.target.value)} />
                        <div className='flex space-x-2 items-center'>
                            <ExclamationCircleIcon className={loginIdErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                            <h1 className='text-s font-extralight text-red-500'>{loginIdErr}</h1>
                        </div>
                        <h1 className='h1'>Password</h1>
                        <input type="password" className='input' value={password} placeholder='Enter your password' name={password} onChange={e => setPassword(e.target.value)} />
                        <div className='flex space-x-2 items-center'>
                            <ExclamationCircleIcon className={passwordErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                            <h1 className='text-s font-extralight text-red-500'>{passwordErr}</h1>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center space-x-2'>
                                <input type="checkbox" defaultChecked={remembered} />
                                <h1 className='cursor-pointer ' onClick={rememberHandler}>Remember me</h1>
                            </div>
                            <button className='cursor-pointer hover:border-b hover:text-red-400'>Forgot Password ?</button>
                        </div>

                        <div className='flex justify-end items-center'>
                            <button className='px-5 py-2 border rounded-full button text-white bg-blue-500' onClick={submitForm}>Sign in</button>
                        </div>
                        <h1 >{error}</h1>

                    </form>
                </div>
                <div>

                </div>
            </main>
        </div>
    )
}

export default Signin
