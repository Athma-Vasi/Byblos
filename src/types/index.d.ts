type WindowSize = {
  width: number;
  height: number;
};

type ResponseState = {
  searchTerm: string;
  searchResults: null | ApiResponseVolume;
};

type ResponseActions = {
  setSearchTerm: "setSearchTerm";
  setSearchResults: "setSearchResults";
  setAll: "setAll";
};

type ResponseDispatch = {
  type: ResponseActions[keyof ResponseActions];
  payload: {
    responseState: ResponseState;
  };
};

type AllStates = {
  responseState: ResponseState;
};

type AllDispatches = {
  responseDispatch: React.Dispatch<ResponseDispatch>;
};

type AllActions = {
  responseActions: ResponseActions;
};

type FormInputNames =
  | "find-allWords"
  | "find-exactPhrase"
  | "find-atLeastOne"
  | "find-none"
  | "resultsPerPage"
  | "filter-downloadFormat"
  | "filter-bookViews"
  | "filter-printType"
  | "title"
  | "author"
  | "publisher"
  | "subject"
  | "isbn"
  | "lccn"
  | "oclc";

//below are the types for the Google Books Api Response
type ApiResponseVolume = {
  kind: Kind;
  totalItems: number;
  items: Volume[];
};

interface Volume {
  kind: Kind;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
}

interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: Epub;
  pdf: Epub;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

interface Epub {
  isAvailable: boolean;
  acsTokenLink?: string;
}

type Kind = "books#volume" | "books#volumes" | "books#bookshelves" | "books#bookshelf";

interface SaleInfo {
  country: string;
  saleability: Saleability;
  isEbook: boolean;
  listPrice?: SaleInfoListPrice;
  retailPrice?: SaleInfoListPrice;
  buyLink?: string;
  offers?: Offer[];
}

interface SaleInfoListPrice {
  amount: number;
  currencyCode: string;
}

interface Offer {
  finskyOfferType: number;
  listPrice: OfferListPrice;
  retailPrice: OfferListPrice;
  giftable: boolean;
}

interface OfferListPrice {
  amountInMicros: number;
  currencyCode: string;
}

type Saleability = "NOT_FOR_SALE" | "FOR_SALE" | string;

interface SearchInfo {
  textSnippet: string;
}

interface VolumeInfo {
  title: string;
  authors: string[];
  publishedDate: string;
  description?: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary?: PanelizationSummary;
  imageLinks?: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
  publisher?: string;
  subtitle?: string;
}

interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

interface IndustryIdentifier {
  type: Type;
  identifier: string;
}

type Type = "OTHER" | "ISBN_10" | "ISBN_13" | "ISSN" | "UUID";

interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

interface ReadingModes {
  text: boolean;
  image: boolean;
}
// above are the types for the Google Books Api Response

export type {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  FormInputNames,
  ResponseActions,
  ResponseDispatch,
  ResponseState,
  Volume,
  WindowSize,
};
