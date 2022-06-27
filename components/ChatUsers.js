import React from 'react'
import Avatar from 'react-avatar'

function ChatUsers({ name, lastMessage = 'dsaldlask', time, counter }) {
    return (
        <div className='flex items-center m-2 p-5 justify-between hover:bg-gray-100 cursor-pointer'>
            {/* Photo */}
            <Avatar className='rounded-full mr-7' name={name[0]} size='60' />
            {/* Name & message */}
            <div className='grow'>
                <h1 className='text-2xl'>{name}</h1>
                <h1 className='text-sm text-gray-500 '>{lastMessage}</h1>
            </div>
            {/* Time & and new message*/}
            <div className='grid grid-rows-2'>
                <h1 className='text-gray-500'>{time}</h1>

            </div>
        </div>

    )
}

export default ChatUsers