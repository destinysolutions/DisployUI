// import React, { useEffect, useState } from 'react';
// import { PublicClientApplication } from "@azure/msal-browser";
// import { Tooltip } from "@material-tailwind/react";
// // import { Client } from "@microsoft/microsoft-graph-client";
// import Onedrive from '../../../public/Assets/one-drive.png';

// const OneDrive = () => {
//     const [app, setApp] = useState(null);
//     const [graphClient, setGraphClient] = useState(null);
//     const [isLoggingIn, setIsLoggingIn] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     useEffect(() => {
//         const msalConfig = {
//             auth: {
//                 clientId: '3e34f72d-7f91-48fe-9805-4946b9b17997',
//                 redirectUri: 'https://onedrive.live.com',
//             },
//         };
//         const msalInstance = new PublicClientApplication(msalConfig);
//         setApp(msalInstance);

//         const accessTokenCallback = async () => {
//             const tokenResponse = await msalInstance.acquireTokenSilent({
//                 scopes: ['user.read', 'files.readwrite'],
//             });
//             return tokenResponse.accessToken;
//         };

//         const accounts = msalInstance.getAllAccounts();
//         setIsLoggedIn(accounts.length > 0);
//     }, []);

//     const handleLogin = async () => {
//         if (isLoggingIn) {
//             return;
//         }

//         setIsLoggingIn(true);

//         try {
//             await app?.loginRedirect({
//                 scopes: ['user.read', 'files.readwrite'],
//             });

//             const accounts = app?.getAllAccounts();
//             setIsLoggedIn(accounts.length > 0);
//         } catch (error) {
//             console.log('Error logging in:', error);
//         } finally {
//             setIsLoggingIn(false);
//         }
//     };

//     const fetchOneDriveData = async () => {
//         try {
//             const response = await graphClient.api('/me/drive/root/children').get();
//             console.log('OneDrive data:', response);
//         } catch (error) {
//             console.log('Error fetching OneDrive data:', error);
//         }
//     };

//     return (
//         <div id="original-tab-id" className='leading-none'>
//             <Tooltip content="OneDrive" placement="bottom-end" className="bg-SlateBlue text-white z-10 ml-6" animate={{
//                 mount: { scale: 1, y: 0 }, unmount: { scale: 1, y: 30 },
//             }}>
//                 {isLoggedIn ? (
//                     <button onClick={fetchOneDriveData} disabled={isLoggingIn}>
//                         <img src={Onedrive} className='w-9' />
//                         {isLoggingIn ? "Logging in..." : "Fetch OneDrive Data"}
//                     </button>
//                 ) : (
//                     <button onClick={handleLogin} disabled={isLoggingIn}>
//                         <img src={Onedrive} className='w-9' />
//                         {isLoggingIn ? "Logging in..." : "Login to OneDrive"}
//                     </button>
//                 )}
//             </Tooltip>
//         </div>
//     )
// }

// export default OneDrive;

import React, { useEffect, useState } from "react";
import * as msal from "@azure/msal-browser";
import { Tooltip } from "@material-tailwind/react";
import Onedrive from "../../images/Assets/one-drive.png";

const OneDrive = () => {
  const [app, setApp] = useState(null);

  const baseUrl = "https://onedrive.live.com/picker";
  const authority = "https://login.microsoftonline.com/common";
  const redirectUri = "http://localhost:5173"; // Update with your web URL
  const clientId = "3e34f72d-7f91-48fe-9805-4946b9b17997"; // Update with your client ID

  useEffect(() => {
    const msalParams = {
      auth: {
        clientId: clientId,
        authority: authority,
        redirectUri: redirectUri,
      },
    };

    const msalInstance = new msal.PublicClientApplication(msalParams);
    setApp(msalInstance);

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
    }
  }, []);

  const launchPicker = async (e) => {
    e.preventDefault();
    const button = e.target;
    button.disabled = true;

    try {
      const authToken = await getToken();

      const params = {
        sdk: "8.0",
        entry: {
          oneDrive: {
            files: {},
          },
        },
        authentication: {},
        messaging: {
          origin: "http://localhost:5173", // Update with your origin
          channelId: "27",
        },
        typesAndSources: {
          mode: "files",
          pivots: {
            oneDrive: true,
            recent: true,
          },
        },
      };

      const queryString = new URLSearchParams({
        filePicker: JSON.stringify(params),
      });

      const url = `${baseUrl}?${queryString}`;
      const pickerWindow = window.open(
        url,
        "OneDrivePicker",
        "width=800,height=600"
      );

      if (!pickerWindow) {
        alert("Popup blocked. Please allow popups for this site.");
      }

      // Listen for messages from the picker window
      window.addEventListener("message", (event) => {
        if (event.data.type === "fileSelected") {
          const selectedFile = event.data.file;
          uploadFileToOneDrive(selectedFile);
        }
      });
    } catch (error) {
      console.error("Error launching picker:", error);
    } finally {
      button.disabled = false;
    }
  };

  async function getToken() {
    let accessToken = "";

    let authParams = { scopes: ["Files.ReadWrite"] }; // Update with the required scopes

    try {
      const resp = await app.acquireTokenSilent(authParams);
      accessToken = resp.accessToken;
    } catch (e) {
      const resp = await app.loginPopup(authParams);
      app.setActiveAccount(resp.account);

      if (resp.idToken) {
        const resp2 = await app.acquireTokenSilent(authParams);
        accessToken = resp2.accessToken;
      }
    }

    return accessToken;
  }

  const uploadFileToOneDrive = async (file) => {
    try {
      const accessToken = await getToken();
      // Define the API endpoint and path to upload the file
      const uploadUrl =
        "https://graph.microsoft.com/v1.0/me/drive/root:/path/to/upload/folder/yourfile.jpg:/content";

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type,
        },
        body: file, // The actual file content
      });

      if (response.ok) {
        console.log("File uploaded successfully!");
      } else {
        console.error("File upload failed:", response.status);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <span id="original-tab-id">
      <Tooltip
        content="OneDrive"
        placement="bottom-end"
        className=" bg-SlateBlue text-white z-10 ml-6"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 1, y: 10 },
        }}
      >
        <button onClick={launchPicker}>
          <img src={Onedrive} className="w-9" />
        </button>
      </Tooltip>
    </span>
  );
};

export default OneDrive;
