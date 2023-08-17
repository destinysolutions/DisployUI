import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { Tooltip } from "@material-tailwind/react";
// import { Client } from "@microsoft/microsoft-graph-client";

import Onedrive from '../../../public/Assets/one-drive.png';

const OneDrive = () => {
    const [app, setApp] = useState(null);
    const [graphClient, setGraphClient] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const msalConfig = {
            auth: {
                clientId: '3e34f72d-7f91-48fe-9805-4946b9b17997',
                redirectUri: 'https://onedrive.live.com',
            },
        };
        const msalInstance = new PublicClientApplication(msalConfig);
        setApp(msalInstance);

        const accessTokenCallback = async () => {
            const tokenResponse = await msalInstance.acquireTokenSilent({
                scopes: ['user.read', 'files.readwrite'],
            });
            return tokenResponse.accessToken;
        };

        // setGraphClient(Client.init({
        //     authProvider: (done) => {
        //         accessTokenCallback()
        //             .then((accessToken) => {
        //                 done(null, accessToken);
        //             })
        //             .catch((error) => {
        //                 done(error, null);
        //             });
        //     }
        // }));

        const accounts = msalInstance.getAllAccounts();
        setIsLoggedIn(accounts.length > 0);
    }, []);

    const handleLogin = async () => {
        if (isLoggingIn) {
            return;
        }

        setIsLoggingIn(true);

        try {
            await app?.loginRedirect({
                scopes: ['user.read', 'files.readwrite'],
            });

            const accounts = app?.getAllAccounts();
            setIsLoggedIn(accounts.length > 0);
        } catch (error) {
            console.log('Error logging in:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const fetchOneDriveData = async () => {
        try {
            const response = await graphClient.api('/me/drive/root/children').get();
            console.log('OneDrive data:', response);
        } catch (error) {
            console.log('Error fetching OneDrive data:', error);
        }
    };

    return (
        <div id="original-tab-id" className='leading-none'>
            <Tooltip content="OneDrive" placement="bottom-end" className="bg-SlateBlue text-white z-10 ml-6" animate={{
                mount: { scale: 1, y: 0 }, unmount: { scale: 1, y: 30 },
            }}>
                {isLoggedIn ? (
                    <button onClick={fetchOneDriveData} disabled={isLoggingIn}>
                        <img src={Onedrive} className='w-9' />
                        {isLoggingIn ? "Logging in..." : "Fetch OneDrive Data"}
                    </button>
                ) : (
                    <button onClick={handleLogin} disabled={isLoggingIn}>
                        <img src={Onedrive} className='w-9' />
                        {isLoggingIn ? "Logging in..." : "Login to OneDrive"}
                    </button>
                )}
            </Tooltip>
        </div>
    )
}

export default OneDrive;
