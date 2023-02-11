import {
  Button,
  Card,
  Center,
  Flex,
  Grid,
  HoverCard,
  NativeSelect,
  Radio,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
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
import { populateSearchTermForFetch } from "../../utils";

type AdvancedSearchProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function AdvancedSearch({
  allStates,
  allActions,
  allDispatches,
}: AdvancedSearchProps) {
  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  let {
    responseState: {
      fetchUrl,
      startIndex,
      searchTerm,
      searchResults,
      selectedVolume,
      selectedAuthor,
      selectedPublisher,
      bookshelfVolumes,
    },
  } = allStates;
  let {
    responseActions: { setAll },
  } = allActions;
  let { responseDispatch } = allDispatches;

  useEffect(() => {
    // selects the default radio buttons on page load because passing checked={true} does not work
    clickDefaultRadioBttns();

    //TESTING ONLY: REMOVE THIS
    populateInputsForTesting();
  }, []);

  async function handleSearchFormSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    //turned into a map for better performance, intellisense and typescript support
    const formDataMap = Array.from(formData.entries()).reduce(
      (formDataObj_: Map<FormInputNames, string>, [inputName, inputValue]) => {
        formDataObj_.set(inputName as FormInputNames, inputValue as string);

        return formDataObj_;
      },
      new Map()
    );

    const searchStr = populateSearchTermForFetch(formDataMap);

    searchTerm = searchStr;

    try {
      const data = await fetchSearchResults(searchStr);

      //initializes localforage keys to initial responseState values for some, and fetched values for others
      searchResults = data as ApiResponseVolume | null;

      await localforage.setItem("byblos-fetchUrl", fetchUrl);
      await localforage.setItem("byblos-startIndex", startIndex);
      await localforage.setItem("byblos-searchTerm", searchTerm);
      await localforage.setItem("byblos-searchResults", searchResults);
      await localforage.setItem("byblos-selectedAuthor", selectedAuthor);
      await localforage.setItem("byblos-selectedPublisher", selectedPublisher);
      await localforage.setItem("byblos-selectedVolume", selectedVolume);
    } catch (error: any) {
      const error_ = new Error(error, { cause: "fetchSearchResults()" });

      console.group("Error in advancedSearch: handleSearchFormSubmit()");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    } finally {
      responseDispatch({
        type: setAll,
        payload: {
          responseState: {
            fetchUrl,
            startIndex,
            searchTerm,
            searchResults,
            selectedVolume,
            selectedAuthor,
            selectedPublisher,
            bookshelfVolumes,
          },
        },
      });

      window.scrollTo(0, 0);
      navigate(`/home/displayResults/1`);
    }
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
    // const title = document.querySelector<HTMLInputElement>(
    //   "[data-textinput='title']"
    // );
    // title === null ? null : (title.defaultValue = "The Uplift War ");
    const author = document.querySelector<HTMLInputElement>(
      "[data-textinput='author']"
    );
    author === null ? null : (author.defaultValue = "c.j. cherryh");
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
      "[data-radioinput='filter-allBooks']"
    );
    allBooksRadio?.click();

    const allContentRadio = document.querySelector<HTMLInputElement>(
      "[data-radioinput='filter-allContent']"
    );
    allContentRadio?.click();

    const allFormatsRadio = document.querySelector<HTMLInputElement>(
      "[data-radioinput='filter-allBooksFormat']"
    );
    allFormatsRadio?.click();
  }

  async function fetchSearchResults(searchString: string) {
    try {
      const fetchStr = `https://www.googleapis.com/books/v1/volumes?q=${searchString}&key=${
        import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      }`;

      const { data } = await axios.get(fetchStr);

      return data as ApiResponseVolume;
    } catch (error: any) {
      const error_ = new Error(error, { cause: "fetchSearchResults()" });

      console.group("Error in advancedSearch");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  return (
    <div>
      <form action="#" method="GET" onSubmit={handleSearchFormSubmit}>
        {/* search term specificity modifiers */}
        <Grid
          columns={width < 576 ? 1 : 4}
          p={width < 576 ? "sm" : "md"}
          align="center"
        >
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Find results</Title>
            </Flex>
          </Grid.Col>

          {/* contains label and inputs */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Flex
              gap="sm"
              direction="column"
              justify="space-evenly"
              align="stretch"
            >
              <Grid
                columns={width < 576 ? 1 : 2}
                align="center"
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
                align="center"
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
                align="center"
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
                align="center"
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={1}>
                  <Text>
                    containing <strong>none</strong> of the words
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    size="lg"
                    name="find-none"
                    data-textinput="find-none"
                  />
                </Grid.Col>
              </Grid>
            </Flex>
          </Grid.Col>
        </Grid>

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* search results amount per page modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          p={width < 576 ? "sm" : "md"}
          align="center"
        >
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Sort by</Title>
            </Flex>
          </Grid.Col>

          <Grid.Col span={width < 576 ? 1 : 1}>
            {width > 576 ? (
              <NativeSelect
                data={["Relevance", "Newest"]}
                // label="Sort by"
                name="sortBy"
                data-nativeselect="sortBy"
              />
            ) : (
              <Flex justify="flex-start" align="center">
                <NativeSelect
                  data={["Relevance", "Newest"]}
                  // label="Sort by"
                  name="sortBy"
                  data-nativeselect="sortBy"
                />
              </Flex>
            )}
          </Grid.Col>
        </Grid>

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* download format section */}
        <Grid
          columns={width < 576 ? 1 : 4}
          p={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* download format heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Download format</Title>
            </Flex>
          </Grid.Col>
          {/* download format body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Radio.Group
              name="filter-downloadFormat"
              description="You can further narrow the search by restricting it to volumes that have an available download format of epub: "
            >
              {/* epub radio input hover card */}
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
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
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
                <HoverCard.Target>
                  <Radio
                    value="epub"
                    label="Epub"
                    data-radioinput="filter-epubFormat"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-epubFormat-dropdown">
                    Only returns results that have an available epub download
                    format
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Radio.Group>
          </Grid.Col>
        </Grid>

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* search book views section: partial, full, e-books(paid, full)*/}
        <Grid
          columns={width < 576 ? 1 : 4}
          p={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* search book views  heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Search</Title>
            </Flex>
          </Grid.Col>

          {/* search book views section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Radio.Group
              name="filter-bookViews"
              description="You can further narrow the search by restricting it to one of the following types of book views: "
            >
              {/* all books radio input hover card */}
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
                <HoverCard.Target>
                  <Radio
                    value=""
                    label="All books"
                    data-radioinput="filter-allBooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-allBooks-dropdown">
                    Default: does not restrict and returns all books
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* partial books radio input hover card */}
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
                <HoverCard.Target>
                  <Radio
                    value="partial"
                    label="Partial books"
                    data-radioinput="filter-partialBooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-partialBooks-dropdown">
                    Returns results where at least part of the text is
                    previewable.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* full books radio input hover card */}
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
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
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
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
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
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
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
                <HoverCard.Target>
                  <Radio
                    value="ebooks"
                    label="All eBooks"
                    data-radioinput="filter-allEbooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-allEbooks-dropdown">
                    Returns all Google eBooks, both free and paid. Examples of
                    non-eBooks would be publisher content that is available in
                    limited preview and not for sale, or magazines.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Radio.Group>
          </Grid.Col>
        </Grid>

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* content section modifiers */}
        <Grid
          columns={width < 576 ? 1 : 4}
          p={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* content section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Content</Title>
            </Flex>
          </Grid.Col>

          {/* print type section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Radio.Group
              name="filter-printType"
              description="You can further narrow the search by restricting  it to a specific print or publication type: "
            >
              {/*  all publication input hover card */}
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
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
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
                <HoverCard.Target>
                  <Radio
                    value="books"
                    label="Books"
                    data-radioinput="filter-books"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text data-radioinput="filter-books-dropdown">
                    Returns only results that are books.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* magazines publication input hover card */}
              <HoverCard
                width={280}
                openDelay={618}
                closeDelay={382}
                shadow="md"
              >
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

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* title section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* title section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Title</Title>
            </Flex>
          </Grid.Col>

          {/* title section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books with the title</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* title search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
                  <HoverCard.Target>
                    <TextInput size="lg" name="title" data-textinput="title" />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="title-dropdown">
                      {
                        "Search for books that contain this word or phrase in the title."
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* author section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* author section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Author</Title>
            </Flex>
          </Grid.Col>

          {/* author section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books with the author</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* author search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
                  <HoverCard.Target>
                    <TextInput
                      size="lg"
                      name="author"
                      data-textinput="author"
                    />
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

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* publisher section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* publisher section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Publisher</Title>
            </Flex>
          </Grid.Col>

          {/* publisher section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books published by</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* publisher search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
                  <HoverCard.Target>
                    <TextInput
                      size="lg"
                      name="publisher"
                      data-textinput="publisher"
                    />
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

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* category section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* category section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>Category</Title>
            </Flex>
          </Grid.Col>

          {/* category section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books in the category</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* category search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
                  <HoverCard.Target>
                    <TextInput
                      size="lg"
                      name="subject"
                      data-textinput="subject"
                    />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text data-textinput="subject-dropdown">
                      {
                        "Search for books that contain this word or phrase within a category. Example: 'fiction'"
                      }
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* isbn section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* isbn section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>ISBN</Title>
            </Flex>
          </Grid.Col>

          {/* isbn section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books with the ISBN</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* isbn search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
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

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* lccn section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* lccn section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>LCCN</Title>
            </Flex>
          </Grid.Col>

          {/* lccn section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books with the LCCN</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* lccn search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
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

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* oclc section modifier */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* oclc section heading */}
          <Grid.Col span={1}>
            <Flex
              align="center"
              justify={width < 576 ? "flex-start" : "center"}
            >
              <Title order={4}>OCLC</Title>
            </Flex>
          </Grid.Col>

          {/* oclc section body */}
          <Grid.Col span={width < 576 ? 1 : 3}>
            <Grid columns={width < 576 ? 1 : 3} align="center">
              <Grid.Col span={1}>
                <Text>Return books with the OCLC</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                {/* oclc search input hover card */}
                <HoverCard
                  width={280}
                  openDelay={618}
                  closeDelay={382}
                  shadow="md"
                >
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

        {Array.from({ length: 3 }).map((_, i) => (
          <Space key={i} h="md" />
        ))}

        {/* submit button */}
        <Grid
          columns={width < 576 ? 1 : 4}
          px={width < 576 ? "sm" : "md"}
          align="center"
        >
          {/* empty div for alignment */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text></Text>
            </Center>
          </Grid.Col>

          <Grid.Col span={width < 576 ? 1 : 2}>
            <Button
              type="submit"
              variant="default"
              size={width < 992 ? "md" : "lg"}
            >
              Search
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </div>
  );
}

export default AdvancedSearch;
