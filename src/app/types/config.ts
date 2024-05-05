import { AvailableLanguages } from './word';

export type Config = {
  languages: {
    [key in AvailableLanguages]: boolean;
  };

  naming: {
    [key in AvailableLanguages]: string;
  };
};
