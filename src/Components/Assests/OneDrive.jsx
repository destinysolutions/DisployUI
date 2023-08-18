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
import Onedrive from '../../../public/Assets/one-drive.png';

const OneDrive = (props) => {
    const [app, setApp] = useState(null);
    const [interactionInProgress, setInteractionInProgress] = useState(false);
    const baseUrl = "https://onedrive.live.com/picker";
    const authority = "https://login.microsoftonline.com/common";

    const redirectUri = "http://localhost:5173"; // your web url
    const clientId = "3e34f72d-7f91-48fe-9805-4946b9b17997"
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://alcdn.msauth.net/browser/2.19.0/js/msal-browser.min.js";
        script.async = true;
        script.onload = apiLoaded;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const apiLoaded = () => {
        const msalParams = {
            auth: {
                clientId: clientId,
                authority: authority,
                redirectUri: redirectUri
            },

        };

        setApp(new msal.PublicClientApplication(msalParams));
    };

    const params = {
        sdk: "8.0",
        entry: {
            oneDrive: {
                files: {}
            }
        },
        authentication: {},
        messaging: {
            origin: "localhost:3000",
            channelId: "27"
        },
        typesAndSources: {
            mode: "files",
            pivots: {
                oneDrive: true,
                recent: true
            }
        }
    };

    let win = null;
    let port = null;

    function combine(...paths) {
        return paths
            .map(path => path.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""))
            .join("/")
            .replace(/\\/g, "/");
    }

    // async function launchPicker(e) {

    //     e.preventDefault();

    //     win = window.open("", "Picker", "height=600,width=1200");

    //     const authToken = await getToken();

    //     const queryString = new URLSearchParams({
    //         filePicker: JSON.stringify(params)
    //     });

    //     const url = `${baseUrl}?${queryString}`;

    //     const form = win.document.createElement("form");
    //     form.setAttribute("action", url);
    //     form.setAttribute("method", "POST");
    //     win.document.body.append(form);

    //     const input = win.document.createElement("input");
    //     input.setAttribute("type", "hidden");
    //     input.setAttribute("name", "access_token");
    //     input.setAttribute("value", authToken);
    //     form.appendChild(input);

    //     form.submit();

    //     window.addEventListener("message", (event) => {

    //         if (event.source && event.source === win) {

    //             const message = event.data;

    //             if (message.type === "initialize" && message.channelId === params.messaging.channelId) {

    //                 port = event.ports[0];

    //                 port.addEventListener("message", messageListener);

    //                 port.start();

    //                 port.postMessage({
    //                     type: "activate"
    //                 });
    //             }
    //         }
    //     });
    // }

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
                    origin: "localhost:5173",
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

            const url = `https://onedrive.live.com/picker?${queryString}`;

            // Open the OneDrive picker in a new popup window
            window.open(url, "OneDrivePicker", "width=800,height=600");
        } catch (error) {
            console.error("Error launching picker:", error);
        } finally {
            button.disabled = false;
            // e.target.disabled = false;
        }
    };

    async function messageListener(message) {
        switch (message.data.type) {

            case "notification":
                console.log(`notification: ${message.data}`);
                break;

            case "command":

                port.postMessage({
                    type: "acknowledge",
                    id: message.data.id
                });

                const command = message.data.data;

                switch (command.command) {

                    case "authenticate":

                        // getToken is from scripts/auth.js

                        const token = await getToken();

                        if (typeof token !== "undefined" && token !== null) {

                            port.postMessage({
                                type: "result",
                                id: message.data.id,
                                data: {
                                    result: "token",
                                    token
                                }
                            });

                        } else {
                            console.error(`Could not get auth token for command: ${JSON.stringify(command)}`);
                        }

                        break;

                    case "close":

                        win.close();
                        break;

                    case "pick":


                        uploadFiles(command);

                        port.postMessage({
                            type: "result",
                            id: message.data.id,
                            data: {
                                result: "success"
                            }
                        });

                        win.close();

                        break;

                    default:

                        console.warn(`Unsupported command: ${JSON.stringify(command)}`, 2);

                        port.postMessage({
                            result: "error",
                            error: {
                                code: "unsupportedCommand",
                                message: command.command
                            },
                            isExpected: true
                        });
                        break;
                }

                break;
        }
    }

    async function getToken() {
        let accessToken = "";

        let authParams = { scopes: ["user.read"] };

        try {

            // see if we have already the idtoken saved
            const resp = await app.acquireTokenSilent(authParams);
            accessToken = resp.accessToken;

        } catch (e) {

            // per examples we fall back to popup
            const resp = await app.loginPopup(authParams);
            app.setActiveAccount(resp.account);

            if (resp.idToken) {

                const resp2 = await app.acquireTokenSilent(authParams);
                accessToken = resp2.accessToken;

            }
        }

        return accessToken;
    }
    const uploadFiles = (commandData) => {

        let data = commandData.items[0];
        let tokenObj = getToken();

        let url = `${data["@sharePoint.endpoint"]}drives/${data.parentReference.driveId}/items/${data.id}`;

        tokenObj.then(token => {
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "image/jpeg"
            };
            fetch(url, {
                method: "GET",
                headers
            }).then(response => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let chunk = "";
                return reader.read().then(function processResult(result) {
                    if (result.done) {
                        return JSON.parse(chunk);
                    }
                    chunk += decoder.decode(result.value, { stream: true });
                    return reader.read().then(processResult);
                });
            }).then(data => {
                processSelectedFile(data);
            }).catch(err => {
                console.log(" some error occured ", err);
            });
        });

    };
    const processSelectedFile = (fileObj) => {
        let link = fileObj["@content.downloadUrl"];
    };
    return (
        <span id="original-tab-id">

            <Tooltip content="OneDrive" placement="bottom-end" className=" bg-SlateBlue text-white z-10 ml-6" animate={{
                mount: { scale: 1, y: 0 }, unmount: { scale: 1, y: 10 },
            }}>
                <button onClick={launchPicker}><img src={Onedrive} className='w-9' /></button>
            </Tooltip>


        </span>
    );
};
export default OneDrive