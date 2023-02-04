import { VolumeWithCustomId } from "../../types";

const defaultVolume: VolumeWithCustomId = {
  kind: "books#volume",
  id: "aZ0YkIU0HusC",
  etag: "2X/1yRxrurA",
  customId: "pretend-this-is-a-random-uuid",
  selfLink: "https://www.googleapis.com/books/v1/volumes/aZ0YkIU0HusC",
  volumeInfo: {
    title: "Mirror Dance",
    authors: ["Lois McMaster Bujold"],
    publisher: "Baen Books",
    publishedDate: "1994",
    description:
      "Injured in his mother's womb, Lord Miles Naismith Vorkosigan, born a dwarf with brittle bones, faces off against his brother, a cloned stranger created to murder Miles and replace him. 35,000 first printing.",
    industryIdentifiers: [
      {
        type: "ISBN_13",
        identifier: "9780671722104",
      },
      {
        type: "ISBN_10",
        identifier: "0671722107",
      },
    ],
    readingModes: {
      text: true,
      image: true,
    },
    pageCount: 316,
    printType: "BOOK",
    categories: ["Fiction"],
    averageRating: 4,
    ratingsCount: 26,
    maturityRating: "NOT_MATURE",
    allowAnonLogging: false,
    contentVersion: "0.1.2.0.preview.3",
    panelizationSummary: {
      containsEpubBubbles: false,
      containsImageBubbles: false,
    },
    imageLinks: {
      smallThumbnail:
        "http://books.google.com/books/content?id=aZ0YkIU0HusC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
      thumbnail:
        "http://books.google.com/books/content?id=aZ0YkIU0HusC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    language: "en",
    previewLink:
      "http://books.google.ca/books?id=aZ0YkIU0HusC&printsec=frontcover&dq=inauthor:lois+mcmaster+bujold&hl=&as_pt=ALLTYPES&cd=21&source=gbs_api",
    infoLink:
      "http://books.google.ca/books?id=aZ0YkIU0HusC&dq=inauthor:lois+mcmaster+bujold&hl=&as_pt=ALLTYPES&source=gbs_api",
    canonicalVolumeLink:
      "https://books.google.com/books/about/Mirror_Dance.html?hl=&id=aZ0YkIU0HusC",
  },
  saleInfo: {
    country: "CA",
    saleability: "NOT_FOR_SALE",
    isEbook: false,
  },
  accessInfo: {
    country: "CA",
    viewability: "PARTIAL",
    embeddable: true,
    publicDomain: false,
    textToSpeechPermission: "ALLOWED",
    epub: {
      isAvailable: true,
      acsTokenLink:
        "http://books.google.ca/books/download/Mirror_Dance-sample-epub.acsm?id=aZ0YkIU0HusC&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api",
    },
    pdf: {
      isAvailable: true,
      acsTokenLink:
        "http://books.google.ca/books/download/Mirror_Dance-sample-pdf.acsm?id=aZ0YkIU0HusC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api",
    },
    webReaderLink:
      "http://play.google.com/books/reader?id=aZ0YkIU0HusC&hl=&as_pt=ALLTYPES&source=gbs_api",
    accessViewStatus: "SAMPLE",
    quoteSharingAllowed: false,
  },
  searchInfo: {
    textSnippet:
      "Injured in his mother&#39;s womb, Lord Miles Naismith Vorkosigan, born a dwarf with brittle bones, faces off against his brother, a cloned stranger created to murder Miles and replace him. 35,000 first printing.",
  },
};

export { defaultVolume };
