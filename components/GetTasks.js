import { CalendarIcon, ChatAltIcon, HomeIcon, LocationMarkerIcon, UserIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'

function GetTasks({ customerName, location, description, endDate, category, ViewTask, technical }) {

    return (

        <div className='border shadow-md pl-4 my-4 py-2 space-y-3'>
            <div className='flex justify-between'>
                <h1 className='h1 text-2xl '>#12345</h1>
                {ViewTask}
            </div>
            <div className='flex items-center space-x-2'>
                <UserIcon className='h-4 text-gray-500' />
                <h3 className='text-lg text-gray-500 font-extralight'>{customerName}</h3>
            </div>
            <div className='flex items-center space-x-2'>
                <HomeIcon className='h-4 text-gray-500' />
                <h3 className='text-lg text-gray-500 font-extralight'>{location}</h3>
            </div>
            <div className='flex items-center space-x-2'>
                <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-hide mr-5' title="Scroll down">
                    {description}
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                <CalendarIcon className='h-4 text-gray-500' />
                <h3 className='text-lg text-gray-500 font-extralight'>{endDate}</h3>
            </div>

            <div className='flex items-center space-x-2'>
                <button className='border shadow-md active:scale-95 transition transform ease-out 
                                     text-blue-500 py-2 px-3 cursor-pointer hover:opacity-80'>{category}</button>
            </div>
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-lg text-gray-500'>{technical}</h1>
                </div>
                <div className='flex space-x-2 mr-5'>
                    <LocationMarkerIcon className='h-7 text-gray-500 cursor-pointer' />
                    <ChatAltIcon className='h-7 text-gray-500 cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

export default GetTasks

