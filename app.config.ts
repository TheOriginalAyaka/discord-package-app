import type { ConfigContext, ExpoConfig } from "expo/config";

const isInternal = (): boolean => {
  const releaseChannel = process.env.RELEASE_CHANNEL;
  return releaseChannel === "internal" || releaseChannel === "beta";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "discord-package-app",
  name: "Dispackage",
  version: "0.8.0",
  ios: {
    ...config.ios,
    icon: isInternal()
      ? "./assets/dispackage-internal.icon"
      : "./assets/dispackage.icon",
  },
  extra: {
    ...config.extra,
    commitHash: process.env.COMMIT_HASH_SHORT,
    releaseChannel: process.env.RELEASE_CHANNEL,
  },
});
