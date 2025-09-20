import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "discord-package-app",
  name: "Dispackage",
  extra: {
    ...config.extra,
    commitHash: process.env.COMMIT_HASH_SHORT,
    releaseChannel: process.env.RELEASE_CHANNEL,
  },
});
