import React from "react";
import {
  FirstlineClient,
  FirstlineClientOptions,
  ExchangeCodeResponse,
  LoginRedirectOptions,
} from "@first-line/firstline-spa-js";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const notWrapped = (): never => {
  throw new Error("You need to wrap your components with <FirstlineProvider>");
};

export interface IFirstlineContext {
  getTokens: () => Promise<ExchangeCodeResponse>;
  getAccessToken: () => Promise<string>;
  loginWithRedirect: (options?: LoginWithRedirectOptions) => Promise<void>;
  verifyEmail: () => Promise<void>;
  logout: () => Promise<any>;
  doRefresh: () => Promise<ExchangeCodeResponse>;

  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  isEmailVerified: boolean;
}

export interface LoginWithRedirectOptions extends LoginRedirectOptions {}

const initialFirstlineContext: IFirstlineContext = {
  getTokens: notWrapped,
  getAccessToken: notWrapped,
  loginWithRedirect: notWrapped,
  verifyEmail: notWrapped,
  logout: notWrapped,
  doRefresh: notWrapped,

  isAuthenticated: false,
  isLoading: true,
  user: undefined,
  isEmailVerified: false,
};

export const FirstlineContext = React.createContext<IFirstlineContext>(
  initialFirstlineContext
);

export interface FirstlineProviderOptions {
  children: React.ReactNode;
  clientOptions: FirstlineClientOptions;
}

export const FirstlineProvider = (
  options: FirstlineProviderOptions
): React.ReactElement => {
  const [client] = React.useState(
    () => new FirstlineClient(options.clientOptions)
  );

  const [loading, setLoading] = React.useState<boolean>(true);
  const [tokens, setTokens] = React.useState<ExchangeCodeResponse>(undefined);
  const [user, setUser] = React.useState<any>(undefined);
  const [isEmailVerified_, setIsEmailVerified_] =
    React.useState<boolean>(undefined);

  const loginWithRedirect = React.useCallback(
    (options?: LoginWithRedirectOptions): Promise<void> =>
      client.loginRedirect(options),
    [client]
  );

  const verifyEmail = React.useCallback(
    (): Promise<void> => client.verifyRedirect(),
    [client]
  );

  const exchangeAuthorizationCode = React.useCallback(
    (
      authorizationCode: string,
      code_verifier: string,
      state: string
    ): Promise<ExchangeCodeResponse> =>
      client.exchangeAuthorizationCode(authorizationCode, code_verifier, state),
    [client]
  );

  const logout = React.useCallback(
    (): Promise<void> => client.logout(),
    [client]
  );

  const doRefresh = React.useCallback(
    (): Promise<ExchangeCodeResponse> => client.doRefresh(),
    [client]
  );

  const getUser = React.useCallback(
    (tokens: ExchangeCodeResponse): Promise<ExchangeCodeResponse> =>
      client.getUser(tokens),
    [client]
  );

  const isEmailVerified = React.useCallback(
    (tokens: ExchangeCodeResponse): boolean => client.isEmailVerified(tokens),
    [client]
  );

  const doExchangeOrRefresh = React.useCallback(
    async (initial = false): Promise<ExchangeCodeResponse> => {
      if (!loading || initial) {
        setLoading(true);
        const tokens = await client.doExchangeOrRefresh();
        setTokens(tokens);

        return tokens;
      }
    },
    [tokens, client, loading, setLoading, setTokens]
  );

  const getTokens =
    React.useCallback(async (): Promise<ExchangeCodeResponse> => {
      return tokens ?? (await doExchangeOrRefresh());
    }, [tokens, doExchangeOrRefresh]);

  const getAccessToken = React.useCallback(
    async (check_expiry: boolean = true): Promise<string> => {
      if (tokens?.access_token && check_expiry) {
        const decodedJwt = parseJwt(tokens.access_token);
        if (decodedJwt.exp * 1000 >= Date.now()) return tokens.access_token;
      }

      if (tokens) return tokens.access_token;
      else {
        const tokens = await doExchangeOrRefresh(); // TODO: add option to prevent redirect and instead throw error which can be handled
        return tokens?.access_token;
      }
    },
    [tokens, doExchangeOrRefresh]
  );

  React.useEffect(() => {
    doExchangeOrRefresh(true).catch((e) => {});
  }, []);

  React.useEffect(() => {
    if (tokens === undefined) return;

    if (tokens?.id_token) {
      const userObject = getUser(tokens);
      setUser(userObject);

      const isEmailVerified_ = isEmailVerified(tokens);
      setIsEmailVerified_(isEmailVerified_);

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [tokens]);

  const firstlineContextValues = React.useMemo(() => {
    return {
      getTokens: getTokens,
      getAccessToken: getAccessToken,
      loginWithRedirect: loginWithRedirect,
      verifyEmail: verifyEmail,
      logout: logout,
      doRefresh: doRefresh,

      isAuthenticated: user ? true : false,
      isLoading: loading,
      user: user,
      isEmailVerified: isEmailVerified_,
    };
  }, [
    getTokens,
    getAccessToken,
    loginWithRedirect,
    exchangeAuthorizationCode,
    verifyEmail,
    logout,
    doRefresh,
    tokens,
    loading,
    user,
    isEmailVerified_,
  ]);

  return (
    <FirstlineContext.Provider value={firstlineContextValues}>
      {options.children}
    </FirstlineContext.Provider>
  );
};

export {
  FirstlineClient,
  FirstlineClientOptions,
  ExchangeCodeResponse,
} from "@first-line/firstline-spa-js";
