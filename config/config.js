
const CONFIG = {
  env: location.hostname === "localhost" ? "local" : "prod",
  firebase: {
    local: {
      apiKey: "LOCAL_API_KEY",
      authDomain: "LOCAL_PROJECT.firebaseapp.com",
      projectId: "LOCAL_PROJECT_ID"
    },
    prod: {
      apiKey: "PROD_API_KEY",
      authDomain: "PROD_PROJECT.firebaseapp.com",
      projectId: "PROD_PROJECT_ID"
    }
  }
};
