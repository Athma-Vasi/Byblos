import {
  Button,
  Center,
  Flex,
  Grid,
  HoverCard,
  NativeSelect,
  Radio,
  Text,
  TextInput,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  FormInputNames,
} from "../../types";

type AdvancedSearchProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function AdvancedSearch({
  allStates: { responseState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: AdvancedSearchProps) {
  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    // selects the default radio buttons on page load because passing checked={true} does not work
    clickDefaultRadioBttns();

    //TESTING ONLY: REMOVE THIS
    populateInputsForTesting();
  }, []);

  async function handleSearchFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    //turned into a map for better performance, intellisense and typescript support
    const formDataMap = Array.from(formData.entries()).reduce(
      (formDataObj_: Map<FormInputNames, string>, [inputName, inputValue]) => {
        formDataObj_.set(inputName as FormInputNames, inputValue as string);

        return formDataObj_;
      },
      new Map(),
    );

    // set resultsPerPage to state
    responseState.resultsPerPage = formDataMap.get("resultsPerPage") as string;

    const searchStr = populateSearchTermForFetch(formDataMap);
    //set searchTerm to state
    responseState.searchTerm = searchStr;
    //set fetchUrl
    responseState.fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchStr}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

    console.log(
      `https://www.googleapis.com/books/v1/volumes?q=${searchStr}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`,
    );

    fetchSearchResults(searchStr);

    //state is updated after all responseState properties are set
    responseDispatch({
      type: responseActions.setAll,
      payload: {
        responseState,
      },
    });
  }

  function populateSearchTermForFetch(formDataMap: Map<FormInputNames, string>) {
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
      formDataMap.get("title") === "" ? "" : `+intitle:${formDataMap.get("title")}`
    }`;

    const searchStrWithAuthor = `${
      formDataMap.get("author") === "" ? "" : `+inauthor:${formDataMap.get("author")}`
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
      formDataMap.get("subject") === "" ? "" : `+subject:${formDataMap.get("subject")}`
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

    const searchStrWithResultsPerPage = `${
      formDataMap.get("resultsPerPage") === "10"
        ? ""
        : `&maxResults=${formDataMap.get("resultsPerPage")}`
    }`;

    const searchStrWithSortBy = `${
      formDataMap.get("sortBy") === "relevance"
        ? ""
        : `&orderBy=${formDataMap.get("sortBy")}`
    }`;

    const searchStrFinal = `${searchStrCondensedComesFirst}${searchStrWithAllCategories}${searchStrWithDownloadFormat}${searchStrWithViewability}${searchStrWithResultsPerPage}${searchStrWithSortBy}${searchStrWithPrintType}`;

    return searchStrFinal;
  }

  function populateInputsForTesting() {
    /*
    const findAll = document.querySelector<HTMLInputElement>(
      "[data-textinput='find-allWords']",
    );
    findAll === null ? null : (findAll.defaultValue = "barrayar");
  
    const findExact = document.querySelector<HTMLInputElement>(
      "[data-textinput='find-exactPhrase']",
    );
    findExact === null ? null : (findExact.defaultValue = "barrayar");
  
    const findAtLeastOne = document.querySelector<HTMLInputElement>(
      "[data-textinput='find-atLeastOne']",
    );
    findAtLeastOne === null ? null : (findAtLeastOne.defaultValue = "barrayar");
  
    const findWithout = document.querySelector<HTMLInputElement>(
      "[data-textinput='find-none']",
    );
    findWithout === null ? null : (findWithout.defaultValue = "barrayar");
  
    */
    // const title = document.querySelector<HTMLInputElement>("[data-textinput='title']");
    // title === null ? null : (title.defaultValue = "hyperion");
    const author = document.querySelector<HTMLInputElement>("[data-textinput='author']");
    author === null ? null : (author.defaultValue = "lois mcmaster bujold");
    // const publisher = document.querySelector<HTMLInputElement>(
    //   "[data-textinput='publisher']",
    // );
    // publisher === null ? null : (publisher.defaultValue = "baen");
    // const subject = document.querySelector<HTMLInputElement>(
    //   "[data-textinput='subject']",
    // );
    // subject === null ? null : (subject.defaultValue = "science fiction");
    // const isbn = document.querySelector<HTMLInputElement>("[data-textinput='isbn']");
    // isbn === null ? null : (isbn.defaultValue = "978-0671578282");
    // const lccn = document.querySelector<HTMLInputElement>("[data-textinput='lccn']");
    // lccn === null ? null : (lccn.defaultValue = " 96024819");
    // const oclc = document.querySelector<HTMLInputElement>("[data-textinput='oclc']");
    // oclc === null ? null : (oclc.defaultValue = " 42320675");
  }

  function clickDefaultRadioBttns() {
    const allBooksRadio = document.querySelector<HTMLInputElement>(
      "[data-radioinput='filter-allBooks']",
    );
    allBooksRadio?.click();

    const allContentRadio = document.querySelector<HTMLInputElement>(
      "[data-radioinput='filter-allContent']",
    );
    allContentRadio?.click();

    const allFormatsRadio = document.querySelector<HTMLInputElement>(
      "[data-radioinput='filter-allBooksFormat']",
    );
    allFormatsRadio?.click();
  }

  async function fetchSearchResults(searchString: string) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchString}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`,
      );

      // set the state of the search results
      //the response state dispatch is centralized inside the async function handleSearchFormSubmit to avoid multiple rerenders
      responseState.searchResults = data as ApiResponseVolume | null;

      navigate(`/home/displayResults/${responseState.activePage}`);
    } catch (error: any) {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.error("error.response: ", error.response);
      } else if (error.request) {
        // client never received a response, or request never left
        console.error("error.request: ", error.request);
      } else {
        // anything else
        console.error("error.message: ", error.message);
      }
    }
  }

  return (
    <div>
      <form action="#" method="GET" onSubmit={handleSearchFormSubmit}>
        {/* search term specificity modifiers */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Find results</Text>
            </Center>
          </Grid.Col>

          {/* contains label and inputs */}
          <Grid.Col span={width < 576 ? 1 : 3} style={{ outline: "2px solid GrayText" }}>
            <Flex gap="sm" direction="column" justify="space-evenly" align="stretch">
              <Grid
                columns={width < 576 ? 1 : 2}
                style={{ outline: "2px solid GrayText" }}
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={1}>
                  <Text>
                    containing <strong>all</strong> of the words
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    size="lg"
                    name="find-allWords"
                    data-textinput="find-allWords"
                  />
                </Grid.Col>
              </Grid>
              <Grid
                columns={width < 576 ? 1 : 2}
                style={{ outline: "2px solid GrayText" }}
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={1}>
                  <Text>
                    containing the <strong>exact phrase</strong>
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    size="lg"
                    name="find-exactPhrase"
                    data-textinput="find-exactPhrase"
                  />
                </Grid.Col>
              </Grid>
              <Grid
                columns={width < 576 ? 1 : 2}
                style={{ outline: "2px solid GrayText" }}
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={1}>
                  <Text>
                    containing <strong>at least one</strong> of the words
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    size="lg"
                    name="find-atLeastOne"
                    data-textinput="find-atLeastOne"
                  />
                </Grid.Col>
              </Grid>
              <Grid
                columns={width < 576 ? 1 : 2}
                style={{ outline: "2px solid GrayText" }}
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={1}>
                  <Text>
                    containing <strong>none</strong> of the words
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput size="lg" name="find-none" data-textinput="find-none" />
                </Grid.Col>
              </Grid>
              {/* search results amount per page modifier */}
              <Grid
                columns={width < 576 ? 2 : 4}
                style={{ outline: "2px solid GrayText" }}
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={width < 576 ? 1 : 2}>
                  {width > 576 ? (
                    <NativeSelect
                      data={["10", "20", "30", "40"]}
                      label="Results per page"
                      name="resultsPerPage"
                      data-nativeselect="resultsPerPage"
                    />
                  ) : (
                    <Flex
                      justify="flex-start"
                      align="center"
                      style={{ outline: "2px solid GrayText" }}
                    >
                      <NativeSelect
                        data={["10", "20", "30", "40"]}
                        label="Results per page"
                        name="resultsPerPage"
                        data-nativeselect="resultsPerPage"
                      />
                    </Flex>
                  )}
                </Grid.Col>

                <Grid.Col span={width < 576 ? 1 : 2}>
                  {width > 576 ? (
                    <NativeSelect
                      data={["relevance", "newest"]}
                      label="Sort by"
                      name="sortBy"
                      data-nativeselect="sortBy"
                    />
                  ) : (
                    <Flex
                      justify="flex-start"
                      align="center"
                      style={{ outline: "2px solid GrayText" }}
                    >
                      <NativeSelect
                        data={["relevance", "newest"]}
                        label="Sort by"
                        name="sortBy"
                        data-nativeselect="sortBy"
                      />
                    </Flex>
                  )}
                </Grid.Col>
              </Grid>
            </Flex>
          </Grid.Col>
        </Grid>
        {/* download format section */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* download format heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Download format</Text>
            </Center>
          </Grid.Col>
          {/* download format body */}
          <Grid.Col span={width < 576 ? 1 : 3} style={{ outline: "2px solid GrayText" }}>
            <Radio.Group
              name="filter-downloadFormat"
              description="You can further narrow the search by restricting it to volumes that have an available download format of epub: "
            >
              {/* epub radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value=""
                    label="All books"
                    data-radioinput="filter-allBooksFormat"
                  />
                </HoverCard.Target>

                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-allBooksFormat-dropdown">
                    Default: does not restrict and returns all books
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* epub radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio value="epub" label="Epub" data-radioinput="filter-epubFormat" />
                </HoverCard.Target>

                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-epubFormat-dropdown">
                    Only returns results that have an available epub download format
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Radio.Group>
          </Grid.Col>
        </Grid>

        {/*  */}
        {/* search book views section: partial, full, e-books(paid, full)*/}
        <Grid
          columns={width < 576 ? 1 : 4}
          style={{ outline: "2px solid GrayText" }}
          p={width < 576 ? "sm" : "md"}
        >
          {/* search book views  heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Search</Text>
            </Center>
          </Grid.Col>

          {/* search book views section body */}
          <Grid.Col span={width < 576 ? 1 : 3} style={{ outline: "2px solid GrayText" }}>
            <Radio.Group
              name="filter-bookViews"
              description="You can further narrow the search by restricting it to one of the following types of book views: "
            >
              {/* all books radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio value="" label="All books" data-radioinput="filter-allBooks" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-allBooks-dropdown">
                    Default: does not restrict and returns all books
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* partial books radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="partial"
                    label="Partial books"
                    data-radioinput="filter-partialBooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-partialBooks-dropdown">
                    Returns results where at least part of the text is previewable.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* full books radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="full"
                    label="Full books"
                    data-radioinput="filter-fullBooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-fullBooks-dropdown">
                    Only returns results where all of the text is viewable.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* e-books radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="free-ebooks"
                    label="Free eBooks"
                    data-radioinput="filter-freeEbooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-freeEbooks-dropdown">
                    Only returns results that are free Google eBooks.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>

              {/* paid e-books radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="paid-ebooks"
                    label="Paid eBooks"
                    data-radioinput="filter-paidEbooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-paidEbooks-dropdown">
                    Only returns results that are Google eBooks with a price.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>

              {/* all Google e-books radio input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="ebooks"
                    label="All eBooks"
                    data-radioinput="filter-allEbooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-allEbooks-dropdown">
                    Returns all Google eBooks, both free and paid. Examples of non-eBooks
                    would be publisher content that is available in limited preview and
                    not for sale, or magazines.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Radio.Group>
          </Grid.Col>
        </Grid>
        {/*  */}
        {/* content section modifiers */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* content section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Content</Text>
            </Center>
          </Grid.Col>

          {/* print type section body */}
          <Grid.Col span={width < 576 ? 1 : 3} style={{ outline: "2px solid GrayText" }}>
            <Radio.Group
              name="filter-printType"
              description="You can further narrow the search by restricting  it to a specific print or publication type: "
            >
              {/*  all publication input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="all"
                    label="All types"
                    data-radioinput="filter-allContent"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-allContent-dropdown">
                    Default: does not restrict and returns all publication types
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* book publication input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio value="books" label="Books" data-radioinput="filter-books" />
                </HoverCard.Target>

                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-books-dropdown">
                    Returns only results that are books.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* magazines publication input hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                <HoverCard.Target>
                  <Radio
                    value="magazines"
                    label="Magazines"
                    data-radioinput="filter-magazines"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-magazines-dropdown">
                    Returns only results that are magazines.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Radio.Group>
          </Grid.Col>
        </Grid>

        {/* title section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* title section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Title</Text>
            </Center>
          </Grid.Col>

          {/* title section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books with the title</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* title search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="title" data-textinput="title" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="title-dropdown">
                      {"Search for books that contain this word or phrase in the title."}
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* author section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* author section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Author</Text>
            </Center>
          </Grid.Col>

          {/* author section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books with the author</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* author search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="author" data-textinput="author" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="author-dropdown">
                      {
                        "Search for books that contain this word or words in the author's name."
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* publisher section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* publisher section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Publisher</Text>
            </Center>
          </Grid.Col>

          {/* publisher section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books published by</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* publisher search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="publisher" data-textinput="publisher" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="publisher-dropdown">
                      {
                        "Search for books that contain this word or phrase in the publisher's name."
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* category section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* category section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Category</Text>
            </Center>
          </Grid.Col>

          {/* category section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books in the category</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* category search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="subject" data-textinput="subject" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="subject-dropdown">
                      {
                        "Search for books that contain this word or phrase within a category. Example: 'science-fiction'"
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* isbn section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* isbn section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>ISBN</Text>
            </Center>
          </Grid.Col>

          {/* isbn section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books with the ISBN</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* isbn search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="isbn" data-textinput="isbn" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="isbn-dropdown">
                      {
                        "Search for books that match this ISBN. The International Standard Book Number is a unique product identifier used in the publishing industry to identify the registrant as well as the specific title, edition and format. Example: '978-0671578282'"
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* lccn section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* lccn section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>LCCN</Text>
            </Center>
          </Grid.Col>

          {/* lccn section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books with the LCCN</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* lccn search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="lccn" data-textinput="lccn" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="lccn-dropdown">
                      {
                        "Search for books that match this LCCN. A Library of Congress Control Number is assigned to a book while the book is being catalogued by the Library of Congress, if it has been selected for addition to the Library's collections. Example: '96024819'"
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* oclc section modifier */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* oclc section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>OCLC</Text>
            </Center>
          </Grid.Col>

          {/* oclc section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid
              columns={width < 576 ? 1 : 3}
              style={{ outline: "2px solid GrayText" }}
              py={width < 576 ? "sm" : "md"}
            >
              <Grid.Col span={1}>
                <Text>Return books with the OCLC</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* oclc search input hover card */}
                <HoverCard width={280} openDelay={618} closeDelay={382} shadow="md">
                  <HoverCard.Target>
                    <TextInput size="lg" name="oclc" data-textinput="oclc" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="oclc-dropdown">
                      {
                        "Search for books that match this OCLC number. Online Computer Library Center is a cooperative, computerized network for libraries and provide bibliographic, abstract and full-text information. They also maintain the Dewey Decimal Classification system. Example: '42320675'"
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* submit button */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          {/* empty div for alignment */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text></Text>
            </Center>
          </Grid.Col>

          <Grid.Col span={width < 576 ? 1 : 2}>
            <Button type="submit" variant="default" size={width < 992 ? "md" : "lg"}>
              Search
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </div>
  );
}

export default AdvancedSearch;
