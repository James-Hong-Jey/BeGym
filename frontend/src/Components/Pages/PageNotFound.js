import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
    return (
        <div>
            <h1>Error 404: Page Not Found</h1>
            <h3>
                Go to Home Page: <Link to="/home"> <button>Home Page</button> </Link>
            </h3>
        </div>
    );
};
