type WindowSize = {
  width: number;
  height: number;
};

// ↓ responseState types
type ResponseState = {
  searchTerm: string;
  fetchUrl: string;
  startIndex: number;
  selectedVolume: null | VolumeWithCustomId;
  selectedAuthor: string;
  selectedPublisher: string;
  searchResults: null | ApiResponseVolume;
  bookshelfVolumes: null | VolumeWithCustomId[];
};

type ResponseActions = {
  setSearchTerm: "setSearchTerm";
  setFetchUrl: "setFetchUrl";
  setStartIndex: "setStartIndex";
  setSelectedVolume: "setSelectedVolume";
  setSelectedAuthor: "setSelectedAuthor";
  setSelectedPublisher: "setSelectedPublisher";
  setSearchResults: "setSearchResults";
  setBookshelfVolumes: "setBookshelfVolumes";
  setAll: "setAll";
};

type ResponseDispatch = {
  type: ResponseActions[keyof ResponseActions];
  payload: {
    responseState: ResponseState;
  };
};
//↑ responseState types

// ↓ themeState types
type ThemeState = {
  theme: "light" | "dark";
};

type ThemeActions = {
  setLightTheme: "setLightTheme";
  setDarkTheme: "setDarkTheme";
};

type ThemeDispatch = {
  type: ThemeActions[keyof ThemeActions];
  payload: {
    themeState: ThemeState;
  };
};
//↑ themeState types

// ↓ navlinksState types
type NavlinksState = {
  isMyLibraryActive: boolean;
  isBookshelfActive: boolean;
  isFavouritesActive: boolean;
  isRatedActive: boolean;
  isMarkReadActive: boolean;
  isReadLaterActive: boolean;
};

type NavlinksActions = {
  setIsMyLibraryActive: "setIsMyLibraryActive";
  setIsBookshelfActive: "setIsBookshelfActive";
  setIsFavouritesActive: "setIsFavouritesActive";
  setIsRatedActive: "setIsRatedActive";
  setIsMarkReadActive: "setIsMarkReadActive";
  setIsReadLaterActive: "setIsReadLaterActive";
};

type NavlinksDispatch = {
  type: NavlinksActions[keyof NavlinksActions];
};

type NavlinksStateActionDispatch = {
  navlinksState: NavlinksState;
  navlinksDispatch: React.Dispatch<NavlinksDispatch>;
  navlinksActions: NavlinksActions;
};
//↑ navlinksState types

type HistoryState = ResponseState[];

type AllStates = {
  responseState: ResponseState;
  themeState: ThemeState;
  navlinksState: NavlinksState;
};

type AllDispatches = {
  responseDispatch: React.Dispatch<ResponseDispatch>;
  themeDispatch: React.Dispatch<ThemeDispatch>;
  navlinksDispatch: React.Dispatch<NavlinksDispatch>;
};

type AllActions = {
  responseActions: ResponseActions;
  themeActions: ThemeActions;
  navlinksActions: NavlinksActions;
};

type FormInputNames =
  | "find-allWords"
  | "find-exactPhrase"
  | "find-atLeastOne"
  | "find-none"
  | "sortBy"
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

// ↓ Bookshelf types
type UserBookshelf = {
  name: string;
  id: string;
  volume: VolumeWithCustomId;
  rating: number;
  favourite: boolean;
  readLater: boolean;
  markRead: boolean;
  dateAdded: Date;
};

type UserBookshelfActions =
  | "rating"
  | "favourite"
  | "readLater"
  | "markRead"
  | "removeVolume";

type ApiResponseUserBookshelf = {
  kind: Kind;
  totalItems: number;
  items: VolumeWithCustomId[];
};

type RatingAction = 1 | 2 | 3 | 4 | 5;
// ↑ bookshelf types

type VolumeWithCustomId = Volume & { customId: string };

//↓ below are the types for the Google Books Api Response
type ApiResponseVolume = {
  kind: Kind;
  totalItems: number;
  items: Volume[];
};

type Volume = {
  kind: Kind;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
};

type AccessInfo = {
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
};

type Epub = {
  isAvailable: boolean;
  acsTokenLink?: string;
};

type Kind =
  | "books#volume"
  | "books#volumes"
  | "books#bookshelves"
  | "books#bookshelf";

type SaleInfo = {
  country: string;
  saleability: Saleability;
  isEbook: boolean;
  listPrice?: SaleInfoListPrice;
  retailPrice?: SaleInfoListPrice;
  buyLink?: string;
  offers?: Offer[];
};

type SaleInfoListPrice = {
  amount: number;
  currencyCode: string;
};

type Offer = {
  finskyOfferType: number;
  listPrice: OfferListPrice;
  retailPrice: OfferListPrice;
  giftable: boolean;
};

type OfferListPrice = {
  amountInMicros: number;
  currencyCode: string;
};

type Saleability = "NOT_FOR_SALE" | "FOR_SALE" | string;

type SearchInfo = {
  textSnippet: string;
};

type VolumeInfo = {
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
};

type ImageLinks = {
  smallThumbnail: string;
  thumbnail: string;
};

type IndustryIdentifier = {
  type: Type;
  identifier: string;
};

type Type = "OTHER" | "ISBN_10" | "ISBN_13" | "ISSN" | "UUID";

type PanelizationSummary = {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
};

type ReadingModes = {
  text: boolean;
  image: boolean;
};
// ↑ above are the types for the Google Books Api Response

export type {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  ApiResponseUserBookshelf,
  FormInputNames,
  HistoryState,
  NavlinksActions,
  NavlinksDispatch,
  NavlinksState,
  NavlinksStateActionDispatch,
  RatingAction,
  ResponseActions,
  ResponseDispatch,
  ResponseState,
  ThemeActions,
  ThemeDispatch,
  ThemeState,
  UserBookshelf,
  UserBookshelfActions,
  Volume,
  WindowSize,
  VolumeWithCustomId,
};
