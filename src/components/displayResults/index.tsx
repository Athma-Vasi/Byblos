import { Center, Flex, Grid, Image, Space, Text, Title } from "@mantine/core";
import { Fragment } from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  Volume,
} from "../../types";
import { insertCustomId } from "../../utils";
import { MyPagination } from "../pagination";
import { Search } from "../search";

type DisplayResultsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayResults({
  children,
  allStates,
  allActions,
  allDispatches,
}: DisplayResultsProps) {
  const { width = 0 } = useWindowSize();
  //required because id from google books api is not unique
  const modifiedSearchResults = insertCustomId(
    allStates.responseState.searchResults?.items ?? [],
  );

  console.log(" modifiedSearchResults: ", modifiedSearchResults);
  return (
    <Fragment>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <Flex gap="xl" direction="column">
        {modifiedSearchResults.map((item) => (
          <Grid key={item.id} columns={9}>
            <Grid.Col span={width < 992 ? 2 : 1}>
              <Center>
                <Image
                  src={item.volumeInfo.imageLinks?.thumbnail}
                  alt="thumbnail of book cover"
                  withPlaceholder
                  placeholder={<Text align="center">No image available</Text>}
                />
              </Center>
            </Grid.Col>
            <Grid.Col span={width < 992 ? 7 : 8}>
              <Title order={3}>{item.volumeInfo.title}</Title>
              {item.volumeInfo.authors?.map((author) => (
                <Text key={author}>{author}</Text>
              ))}
              <Text>{new Date(item.volumeInfo.publishedDate).getFullYear()}</Text>
              <Text lineClamp={4}>{item.volumeInfo.description}</Text>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <MyPagination
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default DisplayResults;
