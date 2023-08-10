

import React, { useEffect, useState } from 'react'
import { PublicClientApplication } from "@azure/msal-browser";

import Onedrive from '../../../public/Assets/one-drive.png'
import { Tooltip } from "@material-tailwind/react";
const OneDrive = () => {
    const [app, setApp] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const msalConfig = {
            auth: {
                clientId: '3e34f72d-7f91-48fe-9805-4946b9b17997',
                redirectUri: 'https://onedrive.live.com',
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
            <Tooltip content="OneDrive" placement="bottom-end" className=" bg-SlateBlue text-white z-10 ml-6" animate={{
                mount: { scale: 1, y: 0 }, unmount: { scale: 1, y: 30 },
            }}>
                <button onClick={handleClick} disabled={isLoggingIn}>

                    <img src={Onedrive} className='w-9' />
                    {isLoggingIn}
                </button>
            </Tooltip>
        </div>
    )
}

export default OneDrive