import React from "react";
import {
  FirstlineClient,
  FirstlineClientOptions,
  ExchangeCodeResponse,
} from "@first-line/firstline-spa-js";

const notWrapped = (): never => {
  throw new Error("You need to wrap your components with <FirstlineProvider>");
};

export interface IFirstlineContext {
  loginRedirect: (options?: any) => Promise<void>;
  verifyRedirect: (options?: any) => Promise<void>;
  exchangeAuthorizationCode: (
    authorizationCode: string,
    code_verifier: string,
    state: string
  ) => Promise<any>;
  exchangeRefreshToken: (refreshToken: string) => Promise<any>;
  logout: () => Promise<any>;
  doExchangeCode: () => Promise<ExchangeCodeResponse>;
  doRefresh: () => Promise<ExchangeCodeResponse>;
  doExchangeOrRefresh: () => Promise<ExchangeCodeResponse>;
  getUser: (tokens: ExchangeCodeResponse) => any;
  isEmailVerified: (tokens: ExchangeCodeResponse) => boolean;
}

const initialFirstlineContext: IFirstlineContext = {
  loginRedirect: notWrapped,
  verifyRedirect: notWrapped,
  exchangeAuthorizationCode: notWrapped,
  exchangeRefreshToken: notWrapped,
  logout: notWrapped,
  doExchangeCode: notWrapped,
  doRefresh: notWrapped,
  doExchangeOrRefresh: notWrapped,
  getUser: notWrapped,
  isEmailVerified: notWrapped,
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

  const loginRedirect = React.useCallback(
    (options?: any): Promise<void> => client.loginRedirect(),
    [client]
  );

  const verifyRedirect = React.useCallback(
    (options?: any): Promise<void> => client.verifyRedirect(),
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

  const exchangeRefreshToken = React.useCallback(
    (authorizationCode: string): Promise<ExchangeCodeResponse> =>
      client.exchangeRefreshToken(authorizationCode),
    [client]
  );

  const logout = React.useCallback(
    (): Promise<void> => client.logout(),
    [client]
  );

  const doExchangeCode = React.useCallback(
    (): Promise<ExchangeCodeResponse> => client.doExchangeCode(),
    [client]
  );

  const doRefresh = React.useCallback(
    (): Promise<ExchangeCodeResponse> => client.doRefresh(),
    [client]
  );

  const doExchangeOrRefresh = React.useCallback(
    (): Promise<ExchangeCodeResponse> => client.doExchangeOrRefresh(),
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

  const firstlineContextValues = React.useMemo(() => {
    return {
      loginRedirect: loginRedirect,
      exchangeAuthorizationCode: exchangeAuthorizationCode,
      exchangeRefreshToken: exchangeRefreshToken,
      verifyRedirect: verifyRedirect,
      logout: logout,
      doExchangeCode: doExchangeCode,
      doRefresh: doRefresh,
      doExchangeOrRefresh: doExchangeOrRefresh,
      getUser: getUser,
      isEmailVerified: isEmailVerified,
    };
  }, [
    loginRedirect,
    exchangeAuthorizationCode,
    exchangeRefreshToken,
    verifyRedirect,
    logout,
    doExchangeCode,
    doRefresh,
    doExchangeOrRefresh,
    isEmailVerified,
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
