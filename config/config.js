const CONFIG = {
  env: location.hostname === "localhost" ? "local" : "prod",
  firebase: {
    local: {
      apiKey: "AIzaSyBefhIgsOJ29u0LC1zGNnZN_QIDi__p8Oc",
      authDomain: "hr-saas-ai-app.firebaseapp.com",
      projectId: "hr-saas-ai-app"
    },
    prod: {
      apiKey: "AIzaSyBefhIgsOJ29u0LC1zGNnZN_QIDi__p8Oc",
      authDomain: "hr-saas-ai-app.firebaseapp.com",
      projectId: "hr-saas-ai-app"
    }
  }
};