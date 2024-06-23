// TODO: add this to definitely typed

type GimeiNameFormats = {
  hiragana: () => string;
  katakana: () => string;
  kanji: () => string;
};
type GimeiNameChecks = {
  isMale: () => boolean;
  isFemale: () => boolean;
};
type GimeiNameOpts = GimeiNameFormats & GimeiNameChecks;
type GimeiFirstName = GimeiNameOpts;
type GimeiLastName = GimeiNameOpts;
type GimeiName = GimeiNameOpts & {
  first: () => GimeiFirstName;
  last: () => GimeiLastName;
};

type GimeiAddressFormats = {
  kanji: () => string;
  hiragana: () => string;
  katakana: () => string;
};
type GimeiAddress = GimeiAddressFormats & {
  prefecture: () => GimeiAddressFormats;
  city: () => GimeiAddressFormats;
  town: () => GimeiAddressFormats;
};

declare module "browser-gimei" {
  export function name(): GimeiName;
  export function male(): GimeiName;
  export function female(): GimeiName;
  export function address(): GimeiAddress;
}
