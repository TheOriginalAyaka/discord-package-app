export * from "./colors";
export * from "./components";
export * from "./fonts";
export * from "./ThemeProvider";
export * from "./utils";

// avoid conflicts
export {
  Text as TText,
  View as TView,
  Card as TCard,
  Surface as TSurface,
  Title as TTitle,
} from "./components";
