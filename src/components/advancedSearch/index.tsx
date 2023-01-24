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
import { RadioGroup } from "@mantine/core/lib/Radio/RadioGroup/RadioGroup";
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
  console.log("width: ", width);

  useEffect(() => {
    clickAllBooksRadioBttn();
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
          <Grid.Col span={width < 576 ? 1 : 2} style={{ outline: "2px solid GrayText" }}>
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
            </Flex>
          </Grid.Col>
          {/* search results amount modifier */}
          <Grid.Col span={1}>
            {width > 576 ? (
              <Center style={{ width: "100%", height: "100%" }}>
                <NativeSelect data={["10", "20", "30", "40"]} label="Results per page" />
              </Center>
            ) : (
              <Flex justify="flex-start" align="center">
                <NativeSelect data={["10", "20", "30", "40"]} label="Results per page" />
              </Flex>
            )}
          </Grid.Col>
        </Grid>
        {/*  */}
        {/* search filters: partial, full, e-books(paid, full)*/}
        <Grid
          columns={width < 576 ? 1 : 4}
          style={{ outline: "2px solid GrayText" }}
          p={width < 576 ? "sm" : "md"}
        >
          {/* filter section heading */}
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Filter</Text>
            </Center>
          </Grid.Col>

          {/* filter section body */}
          <Grid.Col span={width < 576 ? 1 : 2} style={{ outline: "2px solid GrayText" }}>
            <Radio.Group
              name="filterResults"
              description="You can further narrow the search by restricting it to one of the following values: "
            >
              <Radio value="allBooks" label="All books" id="filter-allBooks" />
              <Radio value="partialBooks" label="Partial books" />
              <Radio value="fullBooks" label="Full books" />
              <Radio value="freeEbooks" label="Free e-books" />
              <Radio value="paidEbooks" label="Paid e-books" />
            </Radio.Group>
          </Grid.Col>

          {/* submit button */}
          <Button type="submit" color="blue" variant="outline">
            Search
          </Button>
        </Grid>
      </form>
    </div>
  );
}

export { AdvancedSearch };

function clickAllBooksRadioBttn() {
  const allBooksRadio = document.querySelector<HTMLInputElement>("#filter-allBooks");
  allBooksRadio?.click();
}
