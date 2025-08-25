// Reexport the native module. On web, it will be resolved to DpkgrsModule.web.ts
// and on native platforms to DpkgrsModule.ts
export { default } from "./src/DpkgrsModule";
export * from "./src/Dpkgrs.types";
