import { AvailableLanguages } from './../app/types/word';

export const config = {
  languages: {
    de: true,
    en: true,
    fr: true,
    it: true,
  },

  naming: {
    de: 'deutsch',
    en: 'englisch',
    fr: 'französisch',
    it: 'italienisch',
  },
  tabs: [
    {
      name: 'Home',
      url: '',
    },
    {
      name: 'Training',
      url: 'training',
    },
    {
      name: 'Test',
      url: 'test',
    },
  ],
};
