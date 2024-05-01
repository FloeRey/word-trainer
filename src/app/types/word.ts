export type AvailableLanguages = 'de' | 'fr' | 'en' | 'it';

export type Translations = {
  [key in AvailableLanguages]?: string;
};

export type Word = Translations & {
  id: string;
};

export type Quality = {
  [key: string]: number;
};
