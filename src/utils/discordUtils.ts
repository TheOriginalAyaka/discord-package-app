import type { EmojiData } from "../types";

export function parseDiscordEmoji(text: string): EmojiData {
  const customEmojiMatch = text.match(/^<(a?):([^:]+):(\d+)>$/);
  if (customEmojiMatch) {
    const [, animated, name, id] = customEmojiMatch;
    const extension = animated ? "gif" : "png";
    return {
      isEmoji: true,
      url: `https://cdn.discordapp.com/emojis/${id}.${extension}?size=32`,
      name: name,
    };
  }

  const emojiRegex =
    /^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]+$/u;
  if (emojiRegex.test(text)) {
    return {
      isEmoji: true,
      unicode: text,
      name: text,
    };
  }

  return { isEmoji: false, text };
}

export function getDefaultAvatarUrl(userId: string): string {
  const discriminator = (BigInt(userId) >> BigInt(22)) % BigInt(6);
  return `https://cdn.discordapp.com/embed/avatars/${discriminator}.png`;
}
