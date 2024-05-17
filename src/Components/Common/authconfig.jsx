import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: 'e7a2ab9d-dfc7-42a4-abbb-53b7bca90fc0',
        authority: 'https://login.microsoftonline.com/2d73a5b2-122a-49d2-ac44-c781e61ee294',
        redirectUri: 'http://localhost:3000', // Your redirect URI
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: ["user.read"], // Specify the scopes you need
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};