import { createContext, useEffect, useState } from "react";
import { useFirstline } from "./use-firstline";
import { ExchangeCodeResponse } from "@first-line/firstline-spa-js";

export interface ReactAuthenticationContext {
  getTokens: () => Promise<ExchangeCodeResponse>;
  getAccessToken: () => Promise<string>;
  loginWithRedirect: () => Promise<void>;
  verifyEmail: () => Promise<void>;
  logout: () => Promise<void>;
  doRefresh: () => Promise<ExchangeCodeResponse>;

  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  isEmailVerified: boolean;
}
export const ReactAuthenticationContext =
  createContext<ReactAuthenticationContext>(undefined);

export const ReactAuthenticationProvider = ({ children }) => {
  const {
    loginRedirect,
    verifyRedirect,
    doExchangeOrRefresh,
    logout,
    doRefresh,
    getUser,
    isEmailVerified,
  } = useFirstline();
  const [loading, setLoading] = useState<boolean>(true);
  const [tokens, setTokens] = useState<ExchangeCodeResponse>(undefined);
  const [user, setUser] = useState<any>(undefined);
  const [isEmailVerified_, setIsEmailVerified_] = useState<boolean>(undefined);

  const getTokens = async (): Promise<ExchangeCodeResponse> => {
    return tokens ?? (await doExchangeOrRefresh_());
  };

  const getAccessToken = async (): Promise<string> => {
    if (tokens) return tokens.access_token;
    else {
      const tokens = await doExchangeOrRefresh_();
      return tokens?.access_token;
    }
  };

  const doExchangeOrRefresh_ = async (
    initial = false
  ): Promise<ExchangeCodeResponse> => {
    if (!loading || initial) {
      setLoading(true);
      const tokens = await doExchangeOrRefresh();
      setTokens(tokens);

      return tokens;
    }
  };

  const verifyEmail = async () => {
    await verifyRedirect();
  };

  useEffect(() => {
    doExchangeOrRefresh_(true);
  }, []);

  useEffect(() => {
    if (tokens === undefined) return;

    if (tokens && tokens.id_token) {
      const userObject = getUser(tokens);
      setUser(userObject);

      const isEmailVerified_ = isEmailVerified(tokens);
      setIsEmailVerified_(isEmailVerified_);

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [tokens]);

  return (
    <ReactAuthenticationContext.Provider
      value={{
        getTokens: getTokens,
        getAccessToken: getAccessToken,
        loginWithRedirect: loginRedirect,
        verifyEmail: verifyEmail,
        logout: logout,
        doRefresh: doRefresh,

        isAuthenticated: tokens ? true : false,
        isLoading: loading,
        user: user,
        isEmailVerified: isEmailVerified_,
      }}
    >
      {children}
    </ReactAuthenticationContext.Provider>
  );
};
