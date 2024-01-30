import React, { useEffect, useState } from "react";
import * as msal from "@azure/msal-browser";
import Onedrive from "../../images/Assets/one-drive.png";
import { BrowserCacheLocation, AccountInfo } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { FilePicker } from "@apideck/file-picker";
import "@apideck/file-picker/dist/styles.css";
import axios from "axios";

const OneDrive = ({ setFile }) => {
  // const [app, setApp] = useState(null);
  const baseUrl = "https://onedrive.live.com/picker";
  const authority = `https://login.microsoftonline.com/common`;
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

  // callBackendApi();
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

  const [selectedService, setSelectedService] = useState(null);

  const fetchData = async () => {
    const url = "https://unify.apideck.com/file-storage/files";
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization:
            "Bearer sk_live_18c615f7-b6cd-4ac0-8f3e-b7fd465c511d-z0CYU6dhwX12IO8qUg-f3e8f762-4f83-47e0-a264-5b012b253aca",
          "x-apideck-consumer-id": " test-consumer",
          "x-apideck-app-id": "ZKfil3RXz5ssBdjXqUgYy0KHKYm14M5cXLqUg",
          "x-apideck-service-id": "onedrive",
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createSession = async () => {
    // const url= "https://upload.apideck.com/file-storage/upload-sessions/{id}"
    const url = "https://unify.apideck.com/vault/sessions";
    //unify.apideck.com/vault/sessions

    https: try {
      const { data } = await axios.post(url, {
        headers: {
          Authorization:
            "Bearer sk_live_18c615f7-b6cd-4ac0-8f3e-b7fd465c511d-z0CYU6dhwX12IO8qUg-f3e8f762-4f83-47e0-a264-5b012b253aca",
          "x-apideck-consumer-id": "test-consumer",
          "x-apideck-app-id": "ZKfil3RXz5ssBdjXqUgYy0KHKYm14M5cXLqUg",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetchData();
    // createSession();
    // try {
    //   const data = axios.get(
    //     `https://vault.apideck.com/session/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb25zdW1lcl9pZCI6InRlc3QtY29uc3VtZXIiLCJhcHBsaWNhdGlvbl9pZCI6IlpLZmlsM1JYejVzc0JkalhxVWdZeTBLSEtZbTE0TTVjWExxVWciLCJzY29wZXMiOltdLCJpYXQiOjE3MDI2MTY2NjcsImV4cCI6MTcwMjYyMDI2N30.pIeSxUrkSZp0jhJlXZUgrn8b2wY5fKavCLnzjHVOW6s`,
    //     {
    //       // headers: {
    //       //   Authorization:
    //       //     "Bearer sk_live_18c615f7-b6cd-4ac0-8f3e-b7fd465c511d-z0CYU6dhwX12IO8qUg-f3e8f762-4f83-47e0-a264-5b012b253aca",
    //       //   "x-apideck-consumer-id": "test-consumer",
    //       //   "x-apideck-app-id": "ZKfil3RXz5ssBdjXqUgYy0KHKYm14M5cXLqUg",
    //       //   "x-apideck-service-id": "dropbox",
    //       // },
    //     }
    //   );
    //   console.log(data);
    // } catch (error) {
    //   console.log(error);
    // }
  }, []);

  // const downloadFileUrl = ;
  const session_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb25zdW1lcl9pZCI6InRlc3QtY29uc3VtZXIiLCJhcHBsaWNhdGlvbl9pZCI6IlpLZmlsM1JYejVzc0JkalhxVWdZeTBLSEtZbTE0TTVjWExxVWciLCJzY29wZXMiOltdLCJpYXQiOjE3MDI5MDc3NTEsImV4cCI6MTcwMjkxMTM1MX0.p6o4UWOTysuoOwiIsde_kTaFICa-kN_jEJ268DoSjsg";
  const handleSelect = async (file) => {
    // setFile(file);
    console.log(file);
    // try {
    //   const { data } = await axios.get(
    //     `https://unify.apideck.com/file-storage/files/${file?.id}/download`,
    //     {
    //       headers: {
    //         Authorization:
    //           "Bearer sk_live_18c615f7-b6cd-4ac0-8f3e-b7fd465c511d-z0CYU6dhwX12IO8qUg-f3e8f762-4f83-47e0-a264-5b012b253aca",
    //         "x-apideck-consumer-id": "test-consumer",
    //         "x-apideck-app-id": "ZKfil3RXz5ssBdjXqUgYy0KHKYm14M5cXLqUg",
    //         "x-apideck-service-id": selectedService,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   // console.log(data);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <span id="original-tab-id">
      <FilePicker
        onSelect={handleSelect}
        trigger={
          <button>
            {/* <img src={Onedrive} className="w-9" /> */}
            More options
          </button>
        }
        token={session_token}
        title="Choose file from options"
        showAttribution={false}
        onConnectionSelect={(e) => {
          // console.log(e);
          setSelectedService(e?.service_id);
        }}
      />
      {/* <button onClick={(e) => launchPicker(e)}>
          <img src={Onedrive} className="w-9" />
        </button> */}
    </span>
  );
};

export default OneDrive;
