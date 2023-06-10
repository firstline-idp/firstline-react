import React from "react";
import { ReactAuthenticationContext } from "./ReactAuthenticationContext";

export const useAuthentication = (): ReactAuthenticationContext =>
  React.useContext(ReactAuthenticationContext);
