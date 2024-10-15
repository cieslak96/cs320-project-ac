// aws-config.js
import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "YOUR_REGION",
    userPoolId: "YOUR_USER_POOL_ID",
    userPoolWebClientId: "YOUR_APP_CLIENT_ID",
    mandatorySignIn: true,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});