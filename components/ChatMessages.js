import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ChevronDoubleRightIcon, SearchIcon } from '@heroicons/react/solid'
import Avatar from 'react-avatar'


export default function ChatMessages({ name, recieverMessage, senderMessage }) {
    const [message, setMessage] = useState('')
    const sendMessage = () => {

    }
    return (
        <div>
            {/* Chat Page */}
            <div className='h-[520px] overflow-scroll scrollbar-hide grid grid-row-5'>
                {/* Reciever */}
                <div className='mx-10 my-7 space-y-2 flex items-start space-x-2 justify-self-start w-2/4'>
                    <Avatar className='rounded-full' name={'K'} size='30' color='green' />
                    <div className='flex items-center space-x-2 bg-blue-300 shadow-lg rounded-lg'>
                        <div className=' mt-2 w-full h-fit mr-5 text-xl text-gray-800 font-semibold mx-5 mb-2'>
                            <h1>{recieverMessage}</h1>
                        </div>
                    </div>
                </div>

                {/* Sender */}
                <div className='mx-10 my-7 space-y-2 flex items-start space-x-2 justify-self-end  w-2/4'>
                    <div className='flex items-center space-x-2 bg-gray-100 shadow-lg rounded-lg'>
                        <div className=' mt-2 w-full h-fit mr-5 text-xl text-gray-800 font-semibold mx-5 mb-2'>
                            <h1>{senderMessage}</h1>
                        </div>
                    </div>
                    <Avatar className='rounded-full' name={'K'} size='30' color='green' />
                </div>

                {/* KeyBoard */}
                <div className='flex justify-between items-center bg-gray-100'>
                    <textarea value={message} onChange={() => {
                        setMessage(e.target.value)
                    }} type="text" className="border-none outline-none resize-none w-full shadow-md bg-white p-2 scrollbar-hide mt-2 mb-3 text-lg rounded-lg pl-3" rows="2" cols="20">

                    </textarea>
                    <ChevronDoubleRightIcon
                        onClick={sendMessage}
                        className="h-8 cursor-pointer rounded-full bg-blue-400 p-2 text-white flex mx-3"
                    />
                </div>
            </div>
        </div>
    )
}
