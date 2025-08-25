import { NativeModule, requireNativeModule } from "expo";

import type { DpkgrsModuleEvents } from "./Dpkgrs.types";

declare class DpkgrsModule extends NativeModule<DpkgrsModuleEvents> {
  process: (path: string) => string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<DpkgrsModule>("Dpkgrs");
