import {
  Center,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Space,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { RiHandbagLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  ResponseState,
  Volume,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import DisplayGeneric from "../displayGeneric";
import { MyImageModal } from "../myImageModal";
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
  const { page } = useParams();
  const [localForageFallback, setLocalForageFallback] = useState<VolumeWithCustomId[]>(
    [],
  );

  useEffect(() => {
    const fetchLocalStorageFallback = async () => {
      try {
        localforage
          .getItem<ResponseState["searchResults"]>("byblos-searchResults")
          .then((value) => {
            if (value) {
              setLocalForageFallback(insertCustomId(value?.items ?? []));
            }
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocalStorageFallback();
  }, [allStates.responseState.searchResults]);

  const modifiedSearchResults = insertCustomId(
    allStates.responseState.searchResults?.items ?? [],
  );

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
      <DisplayGeneric
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
        volumes={
          modifiedSearchResults.length === 0 ? localForageFallback : modifiedSearchResults
        }
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <MyPagination
        parentPath="/home/displayResults"
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default DisplayResults;

/**
 <MyImageModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        src={modalSrc}
        alt={modalAlt}
      />
      <Flex gap="xl" direction="column">
        {modifiedSearchResults.map((item) => (
          <Grid key={item.customId} columns={9}>
            <Grid.Col span={width < 992 ? 2 : 1}>
              <Center>
                <Image
                  style={{ cursor: "pointer" }}
                  src={item.volumeInfo.imageLinks?.thumbnail}
                  alt={`thumbnail of ${
                    item.volumeInfo.title ?? "unavailable"
                  } book cover`}
                  onClick={() => {
                    setModalSrc(item.volumeInfo.imageLinks?.thumbnail ?? "");
                    setModalAlt(item.volumeInfo.title);
                    setModalOpened(true);
                  }}
                  withPlaceholder
                  placeholder={<Text align="center">No image available</Text>}
                />
              </Center>
            </Grid.Col>
            <Grid.Col span={width < 992 ? 7 : 8}>
              <Title
                order={3}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleTitleClick(item);
                }}
              >
                {item.volumeInfo.title}
              </Title>
              {item.volumeInfo.authors?.map((author) => (
                <Text key={author} style={{ cursor: "pointer" }}>
                  {author}
                </Text>
              ))}
              <Text>
                {new Date(item.volumeInfo.publishedDate).getFullYear().toString()}
              </Text>
              <Spoiler
                maxHeight={100}
                showLabel="Show more"
                hideLabel="Hide"
                transitionDuration={382}
              >
                <Text>{item.volumeInfo.description}</Text>
              </Spoiler>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
 */
