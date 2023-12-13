import React, { useEffect, useState } from "react";
import * as msal from "@azure/msal-browser";
import { Tooltip } from "@material-tailwind/react";
import Onedrive from "../../images/Assets/one-drive.png";
import { BrowserCacheLocation, AccountInfo } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

const OneDrive = () => {
  // const [app, setApp] = useState(null);
  const baseUrl = "https://onedrive.live.com/picker";
  const authority = `https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a`;
  // const authority = `https://login.microsoftonline.com/${process.env.REACT_APP_ONE_DRIVE_TENANTID}`;
  const redirectUri = "http://localhost:3000"; // Update with your web URL
  const clientId = "78054fb4-56f0-494c-b68c-54a4bc664efd"; // Update with your client ID

  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const msalParams = {
    auth: {
      clientId: clientId,
      authority: authority,
      redirectUri: redirectUri,
      // baseUrl,
      // postLogoutRedirectUri: window.location.origin + "/redirect-auth",
      // navigateToLoginRequestUrl: true,
    },
    // cache: {
    //   cacheLocation: BrowserCacheLocation.LocalStorage,
    // },
    // system: {
    //   allowNativeBroker: false,
    // },
  };

  // const apiLoaded = () => {
  //   setApp(new msal.PublicClientApplication(msalParams));
  // };

  const app = new msal.PublicClientApplication(msalParams);

  const callBackendApi: () => Promise<void> = async () => {
    const pca = new msal.PublicClientApplication(msalParams);
    const init = await pca.initialize();
    const accounts: AccountInfo[] = pca.getAllAccounts();
    if (accounts && accounts[0]) {
      const account: AccountInfo = accounts[0];
      if (account) {
        pca.setActiveAccount(account);
        app?.acquireTokenAndCallApi(pca, account);
      }
    } else {
      const popupRequest: PopupRequest = { scopes: ["scopes"] };
      const res = await pca.acquireTokenPopup(popupRequest);
      if (res && res.accessToken && res.account) {
        pca.setActiveAccount(res.account);
        app?.acquireTokenAndCallApi(pca, res.account);
      }
    }
  };

  callBackendApi();
  function combine(...paths) {
    return paths
      .map((path) => path.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""))
      .join("/")
      .replace(/\\/g, "/");
  }

  const params = {
    sdk: "8.0",
    entry: {
      oneDrive: {
        files: {},
      },
    },
    authentication: {},
    messaging: {
      origin: "localhost:3000",
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

  let win = null;
  let port = null;

  async function launchPicker(e) {
    e.preventDefault();

    win = window.open("", "Picker", "height=600,width=1000");

    try {
      const authToken = await getToken();
      debugger;
      const queryString = new URLSearchParams({
        filePicker: JSON.stringify(params),
        locale: "en-us",
      });
      const accessToken = await getToken(baseUrl);
      console.log(accessToken);
      const url = baseUrl + `/_layouts/15/FilePicker.aspx?${queryString}`;
      console.log(url);

      // const url = `${baseUrl}?${queryString}`;

      const form = win.document.createElement("form");
      form.setAttribute("action", url);
      form.setAttribute("method", "POST");
      win.document.body.append(form);

      const input = win.document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "access_token");
      input.setAttribute("value", authToken);
      form.appendChild(input);

      form.submit();

      window.addEventListener("message", (event) => {
        if (event.source && event.source === win) {
          const message = event.data;

          if (
            message.type === "initialize" &&
            message.channelId === params.messaging.channelId
          ) {
            port = event.ports[0];

            port.addEventListener("message", messageListener);

            port.start();

            port.postMessage({
              type: "activate",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const processSelectedFile = (fileObj) => {
    let link = fileObj["@content.downloadUrl"];
  };
  const uploadFiles = (commandData) => {
    let data = commandData.items[0];
    let tokenObj = getToken();

    let url = `${data["@sharePoint.endpoint"]}drives/${data.parentReference.driveId}/items/${data.id}`;

    tokenObj.then((token) => {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      };
      fetch(url, {
        method: "GET",
        headers,
      })
        .then((response) => {
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
        })
        .then((data) => {
          processSelectedFile(data);
        })
        .catch((err) => {
          console.log(" some error occured ", err);
        });
    });
  };

  async function messageListener(message) {
    switch (message.data.type) {
      case "notification":
        console.log(`notification: ${message.data}`);
        break;

      case "command":
        port.postMessage({
          type: "acknowledge",
          id: message.data.id,
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
                  token,
                },
              });
            } else {
              console.error(
                `Could not get auth token for command: ${JSON.stringify(
                  command
                )}`
              );
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
                result: "success",
              },
            });

            win.close();

            break;

          default:
            console.warn(`Unsupported command: ${JSON.stringify(command)}`, 2);

            port.postMessage({
              result: "error",
              error: {
                code: "unsupportedCommand",
                message: command.command,
              },
              isExpected: true,
            });
            break;
        }

        break;
    }
  }

  async function getToken(command) {
    let accessToken = "";
    let authParams = null;

    switch (command.type) {
      case "SharePoint":
      case "SharePoint_SelfIssued":
        authParams = { scopes: [`${combine(command.resource, ".default")}`] };
        break;
      default:
        break;
    }

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

  // async function getToken() {
  //   let accessToken = "";

  //   let authParams = { scopes: ["OneDrive.ReadWrite"] };

  //   try {
  //     // see if we have already the idtoken saved
  //     const resp = await app.acquireTokenSilent(authParams);
  //     console.log(resp);
  //     accessToken = resp.accessToken;
  //   } catch (e) {
  //     // per examples we fall back to popup
  //     const resp = await app.loginPopup(authParams);
  //     app.setActiveAccount(resp.account);
  //     console.log(resp);
  //     if (resp.idToken) {
  //       const resp2 = await app.acquireTokenSilent(authParams);
  //       accessToken = resp2.accessToken;
  //     }
  //   }

  //   return accessToken;
  // }

  // console.log(app);
  // const launchPicker = async (e) => {
  //   e.preventDefault();
  //   const button = e.target;
  //   button.disabled = true;

  //   try {
  //     const authToken = await getToken();

  //     const params = {
  //       sdk: "8.0",
  //       entry: {
  //         oneDrive: {
  //           files: {},
  //         },
  //       },
  //       authentication: {},
  //       messaging: {
  //         origin: "http://localhost:5173", // Update with your origin
  //         channelId: "27",
  //       },
  //       typesAndSources: {
  //         mode: "files",
  //         pivots: {
  //           oneDrive: true,
  //           recent: true,
  //         },
  //       },
  //     };

  //     const queryString = new URLSearchParams({
  //       filePicker: JSON.stringify(params),
  //     });

  //     const url = `${baseUrl}?${queryString}`;
  //     const pickerWindow = window.open(
  //       url,
  //       "OneDrivePicker",
  //       "width=800,height=600"
  //     );

  //     if (!pickerWindow) {
  //       alert("Popup blocked. Please allow popups for this site.");
  //     }

  //     // Listen for messages from the picker window
  //     window.addEventListener("message", (event) => {
  //       if (event.data.type === "fileSelected") {
  //         const selectedFile = event.data.file;
  //         uploadFileToOneDrive(selectedFile);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error launching picker:", error);
  //   } finally {
  //     button.disabled = false;
  //   }
  // };

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
        <button onClick={(e) => launchPicker(e)}>
          <img src={Onedrive} className="w-9" />
        </button>
      </Tooltip>
    </span>
  );
};

export default OneDrive;
