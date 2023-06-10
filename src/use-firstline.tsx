import React from "react";
import { FirstlineContext, IFirstlineContext } from "./firstline-provider";

export const useFirstline = (): IFirstlineContext =>
  React.useContext(FirstlineContext);
