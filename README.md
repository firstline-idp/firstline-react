## Firstline React

### Usage

#### Adding Firstline-Providers

```jsx
// main.jsx or index.jsx or ...
...
<FirstlineProvider
    clientOptions={{
        domain: env.VITE_DOMAIN,
        audience: env.VITE_AUDIENCE,
        client_id: env.VITE_CLIENT_ID,
        redirect_uri: window.location.origin,
        logout_uri: window.location.origin,
    }}
>
     <ReactAuthenticationProvider>
        <AuthorizationProvider>
            <YOUR_PROVIDERS/>
        </AuthorizationProvider>
    </ReactAuthenticationProvider>
</FirstlineProvider>
```

#### Defining an AuthorizationProvider (example)

Adjust the file below to your use-case.

```jsx
// AuthorizationContext.jsx
import { useAuthentication } from "@first-line/firstline-react";
import { createContext } from "react";

const AuthorizationContext = createContext();
export default AuthorizationContext;

const Loading = () => {
  return (
    <div
      className={
        "full-height flex w-full items-center justify-center overflow-hidden bg-white"
      }
    >
      Loading...
    </div>
  );
};

export const AuthorizationProvider = ({ children }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    getAccessToken,
    isLoading,
    isEmailVerified,
    verifyEmail,
    user,
    doRefresh,
  } = useAuthentication();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    loginWithRedirect(); // redirect to Firsline for signin/signup if not authenticated
    return <Loading />;
  }

  if (isAuthenticated && !isEmailVerified) {
    verifyEmail(); // redirect to Firsline for email-verification if not verified
    return <Loading />;
  }

  return (
    <AuthorizationContext.Provider value={{ getAccessToken, user, doRefresh }}>
      {children}
    </AuthorizationContext.Provider>
  );
};
```

#### Getting the Access-Token

```jsx
import { useAuthentication } from "@first-line/firstline-react";

const { getAccessToken } = useAuthentication(); // call await getAccessToken() where needed
```

#### Getting the current User

```jsx
import { useAuthentication } from "@first-line/firstline-react";

const { user } = useAuthentication();

console.log(user.username, user.email, user.roles);
```
