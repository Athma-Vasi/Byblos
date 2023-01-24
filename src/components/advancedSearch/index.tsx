import {
  Button,
  Center,
  Flex,
  Grid,
  NativeSelect,
  Radio,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect } from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates } from "../types";

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
  }, []);

  async function handleSearchFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log("formDataObj: ", formDataObj);
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
                  <TextInput size="lg" name="find-allWords" />
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
                  <TextInput size="lg" name="find-exactPhrase" />
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
                  <TextInput size="lg" name="find-atLeastOne" />
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
                  <TextInput size="lg" name="find-none" />
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
              name="filterBookViews"
              description="You can further narrow the search by restricting it to one of the following types of book views: "
            >
              <Radio value="allBooks" label="All books" id="filter-allBooks" />
              <Radio value="partialBooks" label="Partial books" />
              <Radio value="fullBooks" label="Full books" />
              <Radio value="freeEbooks" label="Free e-books" />
              <Radio value="paidEbooks" label="Paid e-books" />
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
              name="filterPrintType"
              description="You can further narrow the search by restricting  it to a specific print or publication type: "
            >
              <Radio value="allType" label="All types" id="filter-allContent" />
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
                <TextInput size="lg" name="title" />
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
                <TextInput size="lg" name="author" />
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
                <TextInput size="lg" name="publisher" />
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
                <TextInput size="lg" name="category" />
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
                <TextInput size="lg" name="isbn" />
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
                <TextInput size="lg" name="lccn" />
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
                <TextInput size="lg" name="oclc" />
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
  const allBooksRadio = document.querySelector<HTMLInputElement>("#filter-allBooks");
  allBooksRadio?.click();

  const allContentRadio = document.querySelector<HTMLInputElement>("#filter-allContent");
  allContentRadio?.click();
}
