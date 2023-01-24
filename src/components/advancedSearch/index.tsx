import { Center, Flex, Grid, NativeSelect, Text, TextInput } from "@mantine/core";
import React from "react";
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

  return (
    <div>
      <form action="#" method="GET">
        {/* search term specificity modifiers */}
        <Grid columns={width < 576 ? 1 : 4} p={width < 576 ? "sm" : "md"}>
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Find results</Text>
            </Center>
          </Grid.Col>

          {/* contains label and inputs */}
          <Grid.Col span={width < 576 ? 1 : 2} style={{ outline: "2px solid GrayText" }}>
            <Flex
              gap="sm"
              direction="column"
              justify="space-evenly"
              align="stretch"
              mx={width < 576 ? "sm" : "md"}
            >
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
                  <TextInput size="lg" />
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
                  <TextInput size="lg" />
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
                  <TextInput size="lg" />
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
                  <TextInput size="lg" />
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
              <Flex justify="flex-start" align="center" mx={width < 576 ? "sm" : "md"}>
                <NativeSelect data={["10", "20", "30", "40"]} label="Results per page" />
              </Flex>
            )}
          </Grid.Col>
        </Grid>
        {/* search filters: partial, full, e-books(paid, full)*/}
        <Grid columns={4} style={{ outline: "2px solid GrayText" }}>
          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <Text>Filter</Text>
            </Center>
          </Grid.Col>
        </Grid>
      </form>
    </div>
  );
}

export { AdvancedSearch };
