import React  from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const LinkCard = ({ link }) => {
    
    
    return (
        <>
            <h2>Link</h2>
            <p>Your link: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
            <p>From: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
            <p>Click count: <strong>{link.clicks}</strong></p>
            <p>Creation date: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}