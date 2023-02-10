import localforage from "localforage";
import { v4 as uuidV4 } from "uuid";

import {
  ApiResponseVolume,
  FormInputNames,
  ResponseState,
  VolumeWithCustomId,
} from "../types";

function insertCustomId(
  items: ApiResponseVolume["items"]
): VolumeWithCustomId[] {
  //this function is used to add a custom id to each volume object
  //only used for rendering as there are sometimes duplicate ids returned from the api
  return items.map((item) => {
    const customId = uuidV4();
    const clone = structuredClone(item);
    Object.defineProperty(clone, "customId", {
      value: customId,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return clone as VolumeWithCustomId;
  });
}

function populateSearchTermForFetch(formDataMap: Map<FormInputNames, string>) {
  // this function is used to create the search string for the fetch request
  // from the form data map object
  const searchStrWithAllWords = `${
    formDataMap.get("find-allWords") === ""
      ? ""
      : "+" + formDataMap.get("find-allWords")?.split(" ").join("+")
  }`;

  const searchStrWithExactPhrase = `${
    formDataMap.get("find-exactPhrase") === ""
      ? ""
      : `"${formDataMap.get("find-exactPhrase")}"`
  }`;

  const searchStrWithAtLeastOneWord = `${
    formDataMap.get("find-atLeastOne") === ""
      ? ""
      : formDataMap.get("find-atLeastOne")?.split(" ").join("|")
  }`;

  const searchStrWithWithoutWords = `${
    formDataMap.get("find-none") === ""
      ? ""
      : `-${formDataMap.get("find-none")?.split(" ").join(" -")}`
  }`;

  const searchStrCondensedComesFirst = `${searchStrWithAllWords}${searchStrWithExactPhrase}${searchStrWithAtLeastOneWord}${searchStrWithWithoutWords}`;

  const searchStrWithTitle = `${
    formDataMap.get("title") === ""
      ? ""
      : `+intitle:${formDataMap.get("title")}`
  }`;

  const searchStrWithAuthor = `${
    formDataMap.get("author") === ""
      ? ""
      : `+inauthor:${formDataMap.get("author")}`
  }`;

  const searchStrWithPublisher = `${
    formDataMap.get("publisher") === ""
      ? ""
      : `+inpublisher:${formDataMap.get("publisher")}`
  }`;

  const searchStrWithIsbn = `${
    formDataMap.get("isbn") === "" ? "" : `+isbn:${formDataMap.get("isbn")}`
  }`;

  const searchStrWithSubject = `${
    formDataMap.get("subject") === ""
      ? ""
      : `+subject:${formDataMap.get("subject")}`
  }`;

  const searchStrWithLccn = `${
    formDataMap.get("lccn") === "" ? "" : `+lccn:${formDataMap.get("lccn")}`
  }`;

  const searchStrWithOclc = `${
    formDataMap.get("oclc") === "" ? "" : `+oclc:${formDataMap.get("oclc")}`
  }`;

  const searchStrWithAllCategories = `${searchStrWithTitle}${searchStrWithAuthor}${searchStrWithPublisher}${searchStrWithIsbn}${searchStrWithSubject}${searchStrWithLccn}${searchStrWithOclc}`;

  const searchStrWithDownloadFormat = `${
    formDataMap.get("filter-downloadFormat") === "" ? "" : "&download="
  }${formDataMap.get("filter-downloadFormat")}`;

  const searchStrWithViewability = `${
    formDataMap.get("filter-bookViews") === "" ? "" : "&filter="
  }${formDataMap.get("filter-bookViews")}`;

  const searchStrWithPrintType = `${
    formDataMap.get("filter-printType") === "" ? "" : "&printType="
  }${formDataMap.get("filter-printType")}`;

  const searchStrWithResultsPerPage = `&maxResults=40`;

  const searchStrWithSortBy = `${
    formDataMap.get("sortBy") === "relevance"
      ? ""
      : `&orderBy=${formDataMap.get("sortBy")}`
  }`;

  const searchStrFinal = `${searchStrCondensedComesFirst}${searchStrWithAllCategories}${searchStrWithDownloadFormat}${searchStrWithViewability}${searchStrWithResultsPerPage}${searchStrWithSortBy}${searchStrWithPrintType}`;

  return searchStrFinal;
}

function getLanguageFromCode(code: string) {
  function outputLanguageTable() {
    //copy pasted from http://www.lingoes.net/en/translator/langcode.htm
    //converted to string literal and then into a map object for easier look up
    //used in the overview section when displaying the language of volume

    const langCodesStr = `af	Afrikaans
    af-ZA	Afrikaans (South Africa)
    ar	Arabic
    ar-AE	Arabic (U.A.E.)
    ar-BH	Arabic (Bahrain)
    ar-DZ	Arabic (Algeria)
    ar-EG	Arabic (Egypt)
    ar-IQ	Arabic (Iraq)
    ar-JO	Arabic (Jordan)
    ar-KW	Arabic (Kuwait)
    ar-LB	Arabic (Lebanon)
    ar-LY	Arabic (Libya)
    ar-MA	Arabic (Morocco)
    ar-OM	Arabic (Oman)
    ar-QA	Arabic (Qatar)
    ar-SA	Arabic (Saudi Arabia)
    ar-SY	Arabic (Syria)
    ar-TN	Arabic (Tunisia)
    ar-YE	Arabic (Yemen)
    az	Azeri (Latin)
    az-AZ	Azeri (Latin) (Azerbaijan)
    az-AZ	Azeri (Cyrillic) (Azerbaijan)
    be	Belarusian
    be-BY	Belarusian (Belarus)
    bg	Bulgarian
    bg-BG	Bulgarian (Bulgaria)
    bs-BA	Bosnian (Bosnia and Herzegovina)
    ca	Catalan
    ca-ES	Catalan (Spain)
    cs	Czech
    cs-CZ	Czech (Czech Republic)
    cy	Welsh
    cy-GB	Welsh (United Kingdom)
    da	Danish
    da-DK	Danish (Denmark)
    de	German
    de-AT	German (Austria)
    de-CH	German (Switzerland)
    de-DE	German (Germany)
    de-LI	German (Liechtenstein)
    de-LU	German (Luxembourg)
    dv	Divehi
    dv-MV	Divehi (Maldives)
    el	Greek
    el-GR	Greek (Greece)
    en	English
    en-AU	English (Australia)
    en-BZ	English (Belize)
    en-CA	English (Canada)
    en-CB	English (Caribbean)
    en-GB	English (United Kingdom)
    en-IE	English (Ireland)
    en-JM	English (Jamaica)
    en-NZ	English (New Zealand)
    en-PH	English (Republic of the Philippines)
    en-TT	English (Trinidad and Tobago)
    en-US	English (United States)
    en-ZA	English (South Africa)
    en-ZW	English (Zimbabwe)
    eo	Esperanto
    es	Spanish
    es-AR	Spanish (Argentina)
    es-BO	Spanish (Bolivia)
    es-CL	Spanish (Chile)
    es-CO	Spanish (Colombia)
    es-CR	Spanish (Costa Rica)
    es-DO	Spanish (Dominican Republic)
    es-EC	Spanish (Ecuador)
    es-ES	Spanish (Castilian)
    es-ES	Spanish (Spain)
    es-GT	Spanish (Guatemala)
    es-HN	Spanish (Honduras)
    es-MX	Spanish (Mexico)
    es-NI	Spanish (Nicaragua)
    es-PA	Spanish (Panama)
    es-PE	Spanish (Peru)
    es-PR	Spanish (Puerto Rico)
    es-PY	Spanish (Paraguay)
    es-SV	Spanish (El Salvador)
    es-UY	Spanish (Uruguay)
    es-VE	Spanish (Venezuela)
    et	Estonian
    et-EE	Estonian (Estonia)
    eu	Basque
    eu-ES	Basque (Spain)
    fa	Farsi
    fa-IR	Farsi (Iran)
    fi	Finnish
    fi-FI	Finnish (Finland)
    fo	Faroese
    fo-FO	Faroese (Faroe Islands)
    fr	French
    fr-BE	French (Belgium)
    fr-CA	French (Canada)
    fr-CH	French (Switzerland)
    fr-FR	French (France)
    fr-LU	French (Luxembourg)
    fr-MC	French (Principality of Monaco)
    gl	Galician
    gl-ES	Galician (Spain)
    gu	Gujarati
    gu-IN	Gujarati (India)
    he	Hebrew
    he-IL	Hebrew (Israel)
    hi	Hindi
    hi-IN	Hindi (India)
    hr	Croatian
    hr-BA	Croatian (Bosnia and Herzegovina)
    hr-HR	Croatian (Croatia)
    hu	Hungarian
    hu-HU	Hungarian (Hungary)
    hy	Armenian
    hy-AM	Armenian (Armenia)
    id	Indonesian
    id-ID	Indonesian (Indonesia)
    is	Icelandic
    is-IS	Icelandic (Iceland)
    it	Italian
    it-CH	Italian (Switzerland)
    it-IT	Italian (Italy)
    ja	Japanese
    ja-JP	Japanese (Japan)
    ka	Georgian
    ka-GE	Georgian (Georgia)
    kk	Kazakh
    kk-KZ	Kazakh (Kazakhstan)
    kn	Kannada
    kn-IN	Kannada (India)
    ko	Korean
    ko-KR	Korean (Korea)
    kok	Konkani
    kok-IN	Konkani (India)
    ky	Kyrgyz
    ky-KG	Kyrgyz (Kyrgyzstan)
    lt	Lithuanian
    lt-LT	Lithuanian (Lithuania)
    lv	Latvian
    lv-LV	Latvian (Latvia)
    mi	Maori
    mi-NZ	Maori (New Zealand)
    mk	FYRO Macedonian
    mk-MK	FYRO Macedonian (Former Yugoslav Republic of Macedonia)
    mn	Mongolian
    mn-MN	Mongolian (Mongolia)
    mr	Marathi
    mr-IN	Marathi (India)
    ms	Malay
    ms-BN	Malay (Brunei Darussalam)
    ms-MY	Malay (Malaysia)
    mt	Maltese
    mt-MT	Maltese (Malta)
    nb	Norwegian (Bokm?l)
    nb-NO	Norwegian (Bokm?l) (Norway)
    nl	Dutch
    nl-BE	Dutch (Belgium)
    nl-NL	Dutch (Netherlands)
    nn-NO	Norwegian (Nynorsk) (Norway)
    ns	Northern Sotho
    ns-ZA	Northern Sotho (South Africa)
    pa	Punjabi
    pa-IN	Punjabi (India)
    pl	Polish
    pl-PL	Polish (Poland)
    ps	Pashto
    ps-AR	Pashto (Afghanistan)
    pt	Portuguese
    pt-BR	Portuguese (Brazil)
    pt-PT	Portuguese (Portugal)
    qu	Quechua
    qu-BO	Quechua (Bolivia)
    qu-EC	Quechua (Ecuador)
    qu-PE	Quechua (Peru)
    ro	Romanian
    ro-RO	Romanian (Romania)
    ru	Russian
    ru-RU	Russian (Russia)
    sa	Sanskrit
    sa-IN	Sanskrit (India)
    se	Sami (Northern)
    se-FI	Sami (Northern) (Finland)
    se-FI	Sami (Skolt) (Finland)
    se-FI	Sami (Inari) (Finland)
    se-NO	Sami (Northern) (Norway)
    se-NO	Sami (Lule) (Norway)
    se-NO	Sami (Southern) (Norway)
    se-SE	Sami (Northern) (Sweden)
    se-SE	Sami (Lule) (Sweden)
    se-SE	Sami (Southern) (Sweden)
    sk	Slovak
    sk-SK	Slovak (Slovakia)
    sl	Slovenian
    sl-SI	Slovenian (Slovenia)
    sq	Albanian
    sq-AL	Albanian (Albania)
    sr-BA	Serbian (Latin) (Bosnia and Herzegovina)
    sr-BA	Serbian (Cyrillic) (Bosnia and Herzegovina)
    sr-SP	Serbian (Latin) (Serbia and Montenegro)
    sr-SP	Serbian (Cyrillic) (Serbia and Montenegro)
    sv	Swedish
    sv-FI	Swedish (Finland)
    sv-SE	Swedish (Sweden)
    sw	Swahili
    sw-KE	Swahili (Kenya)
    syr	Syriac
    syr-SY	Syriac (Syria)
    ta	Tamil
    ta-IN	Tamil (India)
    te	Telugu
    te-IN	Telugu (India)
    th	Thai
    th-TH	Thai (Thailand)
    tl	Tagalog
    tl-PH	Tagalog (Philippines)
    tn	Tswana
    tn-ZA	Tswana (South Africa)
    tr	Turkish
    tr-TR	Turkish (Turkey)
    tt	Tatar
    tt-RU	Tatar (Russia)
    ts	Tsonga
    uk	Ukrainian
    uk-UA	Ukrainian (Ukraine)
    ur	Urdu
    ur-PK	Urdu (Islamic Republic of Pakistan)
    uz	Uzbek (Latin)
    uz-UZ	Uzbek (Latin) (Uzbekistan)
    uz-UZ	Uzbek (Cyrillic) (Uzbekistan)
    vi	Vietnamese
    vi-VN	Vietnamese (Viet Nam)
    xh	Xhosa
    xh-ZA	Xhosa (South Africa)
    zh	Chinese
    zh-CN	Chinese (S)
    zh-HK	Chinese (Hong Kong)
    zh-MO	Chinese (Macau)
    zh-SG	Chinese (Singapore)
    zh-TW	Chinese (T)
    zu	Zulu
    zu-ZA	Zulu (South Africa)`;

    //returns a map object with code as key and language as value
    return langCodesStr
      .split("\n")
      .reduce((langTable: Map<string, string>, line) => {
        const [code, ...rest] = line.split("\t");
        langTable.set(code.trim(), rest.join(" ").trim());

        return langTable;
      }, new Map());
  }

  const languageTable: Map<string, string> = outputLanguageTable();

  //returns the language name for the code from the table, else returns the code
  return languageTable.get(code) ?? code;
}

export { getLanguageFromCode, insertCustomId, populateSearchTermForFetch };
