import React from 'react'
import Map, { Marker } from 'react-map-gl'

export default function map() {
    return (
        <div className='h-screen w-screen'>
            <Map
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.mapbox_key}
            >
                <Marker longitude={20} latitude={12} anchor="right" color='#FF0000'>
                </Marker>
            </Map>
        </div>
    )
}
