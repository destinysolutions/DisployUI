

import React, { useEffect, useState } from 'react'
import { PublicClientApplication } from "@azure/msal-browser";
import { FaCloudUploadAlt } from "react-icons/fa";
import Onedrive from '../../../public/Assets/one-drive.png'
const OneDrive = () => {
    const [app, setApp] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const msalConfig = {
            auth: {
                clientId: '3e34f72d-7f91-48fe-9805-4946b9b17997',
                redirectUri: 'https://disploy.thedestinysolutions.com',
            },
        };
        const msalInstance = new PublicClientApplication(msalConfig);
        setApp(msalInstance);
    }, []);

    const handleLogin = async () => {
        if (isLoggingIn) {
            // If an authentication interaction is already in progress, do nothing
            return;
        }

        setIsLoggingIn(true);

        try {
            // Ensure that the user is logged in
            const accounts = app?.getAllAccounts();
            if (accounts.length === 0) {
                // Use the RedirectRequest to handle login manually
                const request = {
                    scopes: ['user.read'],
                };
                await app?.loginRedirect(request);
            }

            // Rest of the code for token acquisition and data fetching remains the same...
        } catch (error) {
            console.log('Error fetching OneDrive data:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleClick = async () => {
        // Prevent login if already logging in
        if (isLoggingIn) {
            return;
        }

        setIsLoggingIn(true);

        try {
            await handleLogin();
        } finally {
            // Re-enable the button after a short delay (e.g., 2 seconds)
            setTimeout(() => setIsLoggingIn(false), 2000);
        }
    };



    return (
        <div id="original-tab-id" className=' leading-none'>
            <button onClick={handleClick} disabled={isLoggingIn}>

                <img src={Onedrive} className='w-9' />
                {isLoggingIn}
            </button>
        </div>
    )
}

export default OneDrive