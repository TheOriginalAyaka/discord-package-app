export type DpkgrsModuleEvents = {
  onProgress: (event: OnProgressEvent) => void;
  onError: (event: OnErrorEvent) => void;
  onComplete: (event: OnCompleteEvent) => void;
  onAnalyticsComplete: (event: OnAnalyticsCompleteEvent) => void;
};

type OnProgressEvent = {
  progress: Progress;
};

type OnErrorEvent = {
  error: IError;
};

type OnCompleteEvent = {
  result: ExtractedData;
};

type OnAnalyticsCompleteEvent = {
  result: EventCount;
};

interface Progress {
  step: "messages" | "analytics" | "scaffolding";
  message: string;
}

interface IError {
  step: "messages" | "analytics" | "scaffolding";
  message: string;
  title: string;
}

export interface ExtractedData {
  user: User | null;
  topDms: TopDM[];
  topChannels: TopChannel[];
  guilds: Guild[];
  dmChannelCount: number;
  channelCount: number;
  messageCount: number;
  characterCount: number;
  hoursValues: number[];
  favoriteWords: PhraseCount[];
  favoriteEmotes: PhraseCount[];
}

interface Guild {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  globalName?: string;
  discriminator: number;
  avatarHash: string | null;
  payments: Payment[];
  relationships: Relationship[];
}

interface Relationship {
  user: {
    id: string;
    username: string;
    globalName?: string;
    discriminator: string;
    avatar?: string;
  };
}

interface Payment {
  status: number;
  currency: string;
  amount: number;
  createdAt: string;
  description: string;
}

interface TopDM {
  id: string;
  dmUserId: string;
  messageCount: number;
}

interface TopChannel {
  id: string;
  name: string | null;
  messageCount: number;
  guildName: string | null;
  guildId: string | null;
}

interface PhraseCount {
  word: string;
  count: number;
}

export interface EventCount {
  applicationCreated: number;
  botTokenCompromised: number;
  emailOpened: number;
  loginSuccessful: number;
  userAvatarUpdated: number;
  appOpened: number;
  notificationClicked: number;
  appCrashed: number;
  appNativeCrash: number;
  oauth2AuthorizeAccepted: number;
  remoteAuthLogin: number;
  captchaServed: number;
  voiceMessageRecorded: number;
  messageReported: number;
  messageEdited: number;
  premiumUpsellViewed: number;
  applicationCommandUsed: number;
  addReaction: number;
  guildJoined: number;
  joinVoiceChannel: number;
  leaveVoiceChannel: number;
  mostUsedCommands: MostUsedCommand[];
  allEvents: number;
}

interface MostUsedCommand {
  commandId: string;
  applicationId: string;
  commandName?: string;
  commandDescription?: string;
  count: number;
}
