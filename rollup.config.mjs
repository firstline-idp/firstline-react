import del from "rollup-plugin-delete";
import typescript from "rollup-plugin-typescript2";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json" assert { type: "json" };
import analyze from "rollup-plugin-analyzer";

const name = "reactFirstline";
const input = "src/index.tsx";
const globals = {
  react: "React",
  "react-dom": "ReactDOM",
};
const externals = ["react", "react-dom", "react/jsx-runtime"];

const plugins = [
  del({ targets: "dist/*", runOnce: true }),
  typescript({ useTsconfigDeclarationDir: true }),
  external(),
  resolve({ browser: true }),
  replace({ __VERSION__: `'${pkg.version}'`, preventAssignment: true }),
  analyze({ summaryOnly: true }),
];

export default [
  {
    input,
    external: externals,
    output: [
      {
        name,
        file: "dist/firstline-react.js",
        format: "umd",
        globals,
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input,
    external: externals,
    output: [
      {
        name,
        file: "dist/firstline-react.min.js",
        format: "umd",
        globals,
        sourcemap: true,
      },
    ],
    plugins: [...plugins, terser()],
  },
  {
    input,
    external: externals,
    output: {
      name,
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    external: externals,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    plugins,
  },
];
