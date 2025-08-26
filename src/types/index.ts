export interface EmojiData {
  isEmoji: boolean;
  url?: string;
  unicode?: string;
  name?: string;
  text?: string;
}

export interface AvatarListItemProps {
  title: string;
  subtitle: string;
  avatarUrl?: string;
  userId?: string;
}

export interface ListItemProps {
  title: string;
  subtitle: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
}

export interface EmojiListItemProps {
  title: string;
  subtitle: string;
}
