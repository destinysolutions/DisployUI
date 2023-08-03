import React, { useEffect, useState } from 'react';
import * as msal from '@azure/msal-browser';

const OneDrive = () => {
    const [files, setFiles] = useState([]);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        if (isLoggingIn) {
            // If an authentication interaction is already in progress, do nothing
            return;
        }

        setIsLoggingIn(true);

        const msalConfig = {
            auth: {
                clientId: 'YOUR_CLIENT_ID',
                redirectUri: 'YOUR_REDIRECT_URI',
            },
        };
        const msalInstance = new msal.PublicClientApplication(msalConfig);

        try {
            // Ensure that the user is logged in
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                await msalInstance.loginPopup();
            }

            // Rest of the code for token acquisition and data fetching remains the same...
        } catch (error) {
            console.log('Error fetching OneDrive data:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div>
            <h2>Files in OneDrive:</h2>
            <button onClick={handleLogin} disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login with OneDrive'}
            </button>
            <ul>
                {files.map((file) => (
                    <li key={file.id}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};
export default OneDrive;
