/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: process.env.CLOUD_INSTANCE + process.env.TENANT_ID, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: process.env.CLIENT_SECRET // Client secret generated from the app registration in Azure portal
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: "Info",
        }
    }
}

const REDIRECT_URI = process.env.NODE_ENV === "production" ? process.env.REDIRECT_URI_PROD : process.env.REDIRECT_URI_DEV;
const POST_LOGOUT_REDIRECT_URI = process.env.NODE_ENV === "production" ? process.env.POST_LOGOUT_REDIRECT_URI_PROD : process.env.POST_LOGOUT_REDIRECT_URI_DEV;

module.exports = {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI
};
