export type DpkgrsModuleEvents = {
  onProgress: (event: OnProgressEvent) => void;
  onError: (event: OnErrorEvent) => void;
  onComplete: (event: OnCompleteEvent) => void;
};

type OnProgressEvent = {
  step: string;
};

type OnErrorEvent = {
  message: string;
};

type OnCompleteEvent = {
  result: ExtractedData;
};

export interface ExtractedData {
  user: User | null;
  topDms: TopDM[];
  topChannels: TopChannel[];
  guildCount: number;
  dmChannelCount: number;
  channelCount: number;
  messageCount: number;
  characterCount: number;
  totalSpent: number;
  hoursValues: number[];
  favoriteWords: FavoriteWord[];
  payments: PaymentInfo;
  openCount: number | null;
  averageOpenCountPerDay: number | null;
  notificationCount: number | null;
  joinVoiceChannelCount: number | null;
  joinCallCount: number | null;
  addReactionCount: number | null;
  messageEditedCount: number | null;
  sentMessageCount: number | null;
  averageMessageCountPerDay: number | null;
  slashCommandUsedCount: number | null;
}

interface User {
  id: string;
  username: string;
  globalName: string;
  discriminator: number;
  avatarHash: string | null;
  payments: Payment[];
  flags: string[];
  relationships: Relationship[];
}

interface Relationship {
  user: {
    id: string;
    username: string;
    globalName: string;
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

interface PaymentInfo {
  total: Record<string, number>;
  list: string;
}

interface TopDM {
  id: string;
  dmUserId: string;
  messageCount: number;
}

interface TopChannel {
  name: string;
  messageCount: number;
  guildName: string | null;
}

interface FavoriteWord {
  word: string;
  count: number;
}
