import React from 'react';
import Header from '../Archive/header';
import { Redirect } from 'react-router-dom';

function FriendsPage({ authorized }) {
    if (!authorized) {
        return <Redirect to="/login" />
    }
    return (
        <div>
            <Header />
        </div>
    );
};

export default FriendsPage;