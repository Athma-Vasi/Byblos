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
import React, { useEffect } from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates, FormInputNames } from "../types";

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

  useEffect(() => {
    // selects the default radio buttons on page load because passing checked={true} does not work
    clickDefaultRadioBttns();

    //TESTING ONLY: REMOVE THIS
    populateInputsForTesting();
  }, []);

  async function handleSearchFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    //turned into a map for better intellisense and typescript support
    const formDataMap = Array.from(formData.entries()).reduce(
      (
        formDataObj_: Map<FormInputNames, FormDataEntryValue>,
        [inputName, inputValue],
      ) => {
        formDataObj_.set(inputName as FormInputNames, inputValue);
        return formDataObj_;
      },
      new Map(),
    );
    console.log("formDataMap: ", formDataMap);
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
                columns={width < 576 ? 1 : 4}
                style={{ outline: "2px solid GrayText" }}
                py={width < 576 ? "sm" : "md"}
              >
                <Grid.Col span={1}>
                  {width > 576 ? (
                    <NativeSelect
                      data={["10", "20", "30", "40"]}
                      label="Results per page"
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
                      />
                    </Flex>
                  )}
                </Grid.Col>
              </Grid>
            </Flex>
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
              {/* all books radio with hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382}>
                <HoverCard.Target>
                  <Radio
                    value="allBooks"
                    label="All books"
                    data-radioinput="filter-allBooks"
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>Default: does not filter and returns all books</Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* partial books radio with hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382}>
                <HoverCard.Target>
                  <Radio value="partialBooks" label="Partial books" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>
                    Returns results where at least part of the text is previewable.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* full books radio with hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382}>
                <HoverCard.Target>
                  <Radio value="fullBooks" label="Full books" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>Only returns results where all of the text is viewable.</Text>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* e-books radio with hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382}>
                <HoverCard.Target>
                  <Radio value="freeEbooks" label="Free eBooks" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>Only returns results that are free Google eBooks.</Text>
                </HoverCard.Dropdown>
              </HoverCard>

              {/* paid e-books radio with hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382}>
                <HoverCard.Target>
                  <Radio value="paidEbooks" label="Paid eBooks" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>Only returns results that are Google eBooks with a price.</Text>
                </HoverCard.Dropdown>
              </HoverCard>

              {/* all Google e-books radio with hover card */}
              <HoverCard width={280} openDelay={618} closeDelay={382}>
                <HoverCard.Target>
                  <Radio value="allEbooks" label="All eBooks" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>
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
              <Radio
                value="allType"
                label="All types"
                data-radioinput="filter-allContent"
              />
              <Radio value="books" label="Books" />
              <Radio value="magazines" label="Magazines" />
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
                <TextInput size="lg" name="title" data-textinput="title" />
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
                <TextInput size="lg" name="author" data-textinput="author" />
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
                <TextInput size="lg" name="publisher" data-textinput="publisher" />
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
                <TextInput size="lg" name="category" data-textinput="category" />
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
                <TextInput size="lg" name="isbn" data-textinput="isbn" />
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
                <Text>Return books with the Library of Congress Control Number</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                <TextInput size="lg" name="lccn" data-textinput="lccn" />
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
                <Text>Return books with the Online Computer Library Center Number</Text>
              </Grid.Col>
              <Grid.Col span={width < 576 ? 1 : 2}>
                <TextInput size="lg" name="oclc" data-textinput="oclc" />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {/* submit button */}
        <Button type="submit" color="blue" variant="outline">
          Search
        </Button>
      </form>
    </div>
  );
}

export { AdvancedSearch };

function clickDefaultRadioBttns() {
  const allBooksRadio = document.querySelector<HTMLInputElement>(
    "[data-radioinput='filter-allBooks']",
  );
  allBooksRadio?.click();

  const allContentRadio = document.querySelector<HTMLInputElement>(
    "[data-radioinput='filter-allContent']",
  );
  allContentRadio?.click();

  const oclc = document.querySelector<HTMLInputElement>("[data-textinput='oclc']");
  oclc === null ? null : (oclc.defaultValue = "oclc");
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

  const title = document.querySelector<HTMLInputElement>("[data-textinput='title']");
  title === null ? null : (title.defaultValue = "barrayar");

  const author = document.querySelector<HTMLInputElement>("[data-textinput='author']");
  author === null ? null : (author.defaultValue = "lois mcmaster bujold");

  const publisher = document.querySelector<HTMLInputElement>(
    "[data-textinput='publisher']",
  );
  publisher === null ? null : (publisher.defaultValue = "baen");

  const subject = document.querySelector<HTMLInputElement>("[data-textinput='category']");
  subject === null ? null : (subject.defaultValue = "science fiction");

  const isbn = document.querySelector<HTMLInputElement>("[data-textinput='isbn']");
  isbn === null ? null : (isbn.defaultValue = "978-0-671-03142-9");

  const lccn = document.querySelector<HTMLInputElement>("[data-textinput='lccn']");
  lccn === null ? null : (lccn.defaultValue = " 2001022200");

  const oclc = document.querySelector<HTMLInputElement>("[data-textinput='oclc']");
  oclc === null ? null : (oclc.defaultValue = " 12345678");
}
