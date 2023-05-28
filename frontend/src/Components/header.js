import React from 'react'
import pushup from './pushup.png'

export default function Header() {
    const containerStyle = {
        position: 'relative',
        backgroundImage: 'url("./pushup.png")',
        backgroudnSize: 'cover',
        backgroundPosition: 'center',
    }
    return (
        <div style={containerStyle}>
            <h1 className='header'>BeGym</h1>
            <img src={pushup} className='headerPhoto' alt="" />

        </div>
    )
}
// source: https://hips.hearstapps.com/hmg-prod/images/mh-formcheck-index-social-1551985785.png
//backgroundImage: 'url("./pushup.png")',