export * from "./colors";
export * from "./ThemeProvider";
export * from "./components";
export * from "./utils";
export * from "./fonts";

// avoid conflicts
export {
  Text as TText,
  View as TView,
  Card as TCard,
  Surface as TSurface,
  Title as TTitle,
} from "./components";
