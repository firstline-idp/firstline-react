# Firstline React

This library enables you to add authentication to your React app.

## Helpful resources

- [Quick setup](https://docs.firstline.sh/quicksetup) - our guide for quickly adding login, logout and user information to a React app using Firstline.
- [React sample app](https://github.com/firstline-idp/firstline-react) - a full-fledged React application integrated with Firstline.
- [Firstline docs](https://docs.firstline.sh) - explore our docs site and learn more about Firstline.

## Getting started

### 1. Setup Firstline Application & API
1. Follow the [Quick setup](https://docs.firstline.sh/quicksetup) to configure a Firstline Application.
2. Add a Firstline API as shown in [Secure API](https://docs.firstline.sh/secure-api).

**Important:** Don't forget to configure the Application URIs.

### 2. Installation

Using npm:

```sh
npm install @first-line/firstline-react
```

Using yarn:

```sh
yarn add @first-line/firstline-react
```

**Hint:** You can also try out our [React sample app](https://github.com/firstline-idp/sample-firstline-react).

### 3. Wrap your React app with Firstline context.

Wrap your app with the Firstline context. Replace **DOMAIN**, **API_IDENTIFIER** and **CLIENT_ID** with the settings you configured in the setup step. You can also find them in the Application's and API's "Configure" tab in your dashboard.

```jsx
// This file is often named index.jsx or _app.jsx
import { FirstlineContext } from "@first-line/firstline-react";

const App = () => {
  return (
    <FirstlineContext
      audience="API_IDENTIFIER"
      domain="DOMAIN"
      client_id="CLIENT_ID"
      redirect_uri={window.location.origin}
    >
    ...  {/* your existing components */}
    </FirstlineContext>
  );
};
```

### 4. Add login & logout to your application

Implement the following component in your frontend and you have a fully functional login/logout.

```jsx
import { useFirstline } from "@first-line/firstline-react";

const MyComponent = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useFirstline();
  
  return (
    <>
      {isAuthenticated ? (
        <div>
          <p>{user.email}</p>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </>
  );
};
```

You can call useFirstline() from anywhere in your application to
- log in
- log out
- check if the user is signed in
- retrieve the logged in user

### 5. Make a secured backend call

Here is sample code on how to make an API request to a secured endpoint.

```jsx
import { useState } from "react";
import { useFirstline } from "@first-line/firstline-react";

const Posts = () => {
  const { getAccessToken } = useFirstline();
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const response = await fetch("http://localhost:8080/posts", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    const data = await response.json();
    setPosts(data);
  };

  return (
    <div>
      <button onClick={loadPosts}>Load Posts</button>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    </div>
  );
};
```

In this example, we assume that the API endpoint http://localhost:8080/posts exists.

**Important:** The user must be logged in when calling `getAccessToken()`. Therefore, use `isAuthenticated`.

