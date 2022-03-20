import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Header from '../components/Header'

function Signup() {

    const router = useRouter()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    // error catch
    const [nameErr, setNameErr] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [password1Err, setPassword1Err] = useState('')
    const [password2Err, setPassword2Err] = useState('')
    // icon catch
    const [nameErrIcon, setNameErrIcon] = useState(false)
    const [emailErrIcon, setEmailErrIcon] = useState(false)
    const [password1ErrIcon, setPassword1ErrIcon] = useState(false)
    const [password2ErrIcon, setPassword2ErrIcon] = useState(false)


    // sign up
    const submitForm = async (e) => {
        setNameErr('')
        setEmailErr('')
        setPassword1Err('')
        setPassword2Err('')
        setEmailErrIcon(false)
        setPassword1ErrIcon(false)
        setNameErrIcon(false)
        setPassword2ErrIcon(false)
        e.preventDefault()
        const res = await fetch('http://localhost:8000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password2,
            })

        }).then((t) => t.json())
        console.log(res)

        const error = res.errors
        if (!error) {
            router.push({
                pathname: '/signin'
            })
            return
        } else {
            if (error.name) {
                setNameErr(error.name)
                setNameErrIcon(true)
            }
            if (error.email) {
                setEmailErr(error.email)
                setEmailErrIcon(true)
            }
            if (error.password) {
                setPassword1Err(error.password)
                setPassword1ErrIcon(true)
            }
            if (error.password2) {
                setPassword2Err(error.password2)
                setPassword2ErrIcon(true)
            }
        }




    }


    return (
        <div>
            <Header />
            <main className='mx-auto max-w-10xl px-8 grid grid-cols-2'>
                <div>
                    <img src="/Sign up-amico.svg" alt="" className='w-5/6 mt-16' />
                </div>
                <div className='flex pt-16 px-24'>
                    <form method='POST' className='flex flex-col space-y-5 mb-7'>
                        <h1 className='h1 text-2xl pr-40'>Create a new account</h1>
                        <h1 className='h1'>Name</h1>
                        <input type="name" className='input' placeholder='Enter your full name' onChange={e => setName(e.target.value)} />
                        <div className='flex space-x-2 items-center'>
                            <ExclamationCircleIcon className={nameErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                            <h1 className='text-s font-extralight text-red-500'>{nameErr}</h1>
                        </div>
                        <h1 className='h1'>Email</h1>
                        <input type="email" className='input flex' placeholder='Enter your email' onChange={e => setEmail(e.target.value)} />
                        <div className='flex space-x-2 items-center'>
                            <ExclamationCircleIcon className={emailErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                            <h1 className='text-s font-extralight text-red-500'>{emailErr}</h1>
                        </div>
                        <h1 className='h1'>Password</h1>
                        <input type="password" className='input' placeholder='New password' onChange={e => setPassword(e.target.value)} />
                        <div className='flex space-x-2 items-center'>
                            <ExclamationCircleIcon className={password1ErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                            <h1 className='text-s font-extralight text-red-500'>{password1Err}</h1>
                        </div>
                        <h1 className='h1'>Confirm password</h1>
                        <input type="password" className='input' placeholder='Re-enter New password' onChange={e => setPassword2(e.target.value)} />
                        <div className='flex space-x-2 items-center'>
                            <ExclamationCircleIcon className={password2ErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                            <h1 className='text-s font-extralight text-red-500'>{password2Err}</h1>
                        </div>
                        <div className='flex justify-between items-center'>
                            <h1 className=' text-red-500 cursor-pointer hover:border-b' onClick={() => {
                                router.push({
                                    pathname: '/signin'
                                })
                            }}>Already have an account</h1>
                            <button className='px-5 py-2 border rounded-full button text-white bg-blue-500' onClick={submitForm}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Signup