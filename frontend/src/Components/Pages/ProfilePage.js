import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProfilePage() {

    let { id } = useParams();
    return (
        <div className='profilePageContainer'>
            <div className='basicInfo'><h1> Username: </h1></div>
            <div className='listOfPosts'></div>
            <h1>Profile Page</h1>
            
        </div>
    );
};
