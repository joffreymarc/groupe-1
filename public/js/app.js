let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "groupe1-arla.eu.auth0.com",
    client_id: "FFebaGnJyvGZv6cVA6GneJcExRAWsS3a"
  });
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
};

const logout = async () => {
  // this will break on localhost since we need a public address
  // for auth0 to come back us
  auth0.logout({ returnTo: window.location.origin });
};

const togglePreminumContent = async isAuthenticated => {
  if (isAuthenticated) {
    document.getElementById("premium-content").style = "visibility: visible;";
    const userProfile = await auth0.getUser();
    document.getElementById("premium-user-profile").innerHTML = JSON.stringify(
      userProfile,
      null,
      2
    );
  } else {
    document.getElementById("premium-content").style = "visibility: hidden;";
  }
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  await togglePreminumContent(isAuthenticated);

  const query = window.location.search;
  // Handles the callback once we entered our credentials password
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
    updateUI();
  }
};

window.onload = async () => {
  console.log("init auth0 SDK...");
  try {
    await configureClient();
    console.log("auth0 SDK init successfully");
    await updateUI();
  } catch {
    console.log("ERROR: could not init auth0 SDK");
  }
};
