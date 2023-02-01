import {
  Center,
  Flex,
  Grid,
  Highlight,
  Image,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import { MyImageModal } from "../myImageModal";

type DisplayGenericProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
  volumes: VolumeWithCustomId[];
};

function DisplayGeneric({
  children,
  volumes,
  allStates,
  allActions,
  allDispatches,
}: DisplayGenericProps) {
  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");
  const [localForageFallback, setLocalForageFallback] = useState<VolumeWithCustomId[]>(
    [],
  );

  console.log("volumes from displayGeneric: ", volumes);

  useEffect(() => {
    const fetchLocalStorageFallback = async () => {
      try {
        // localforage.getItem<ResponseState>("responseState").then((value) => {
        //   console.log("value from displayGeneric: ", value);
        //   if (value) {
        //     setLocalForageFallback(insertCustomId(value.searchResults?.items ?? []));
        //   }
        // });

        const value = await localforage.getItem<ResponseState["searchResults"]>(
          "byblos-searchResults",
        );
        console.log("value from displayGeneric: ", value);
        if (value) {
          setLocalForageFallback(insertCustomId(value?.items ?? []));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLocalStorageFallback();
  }, []);

  async function handleTitleClick(volume: VolumeWithCustomId) {
    allStates.responseState.activePage = 1;
    allStates.responseState.searchTerm = volume.volumeInfo.title;
    allStates.responseState.selectedVolume = volume;
    allStates.responseState.selectedAuthor = volume.volumeInfo.authors?.[0] ?? "";
    allStates.responseState.selectedPublisher = volume.volumeInfo.publisher ?? "";

    try {
      localforage.setItem<ResponseState["activePage"]>(
        "byblos-activePage",
        allStates.responseState.activePage,
      );

      localforage.setItem<ResponseState["searchTerm"]>(
        "byblos-searchTerm",
        allStates.responseState.searchTerm,
      );

      localforage.setItem<ResponseState["selectedVolume"]>(
        "byblos-selectedVolume",
        allStates.responseState.selectedVolume,
      );

      localforage.setItem<ResponseState["selectedAuthor"]>(
        "byblos-selectedAuthor",
        allStates.responseState.selectedAuthor,
      );

      localforage.setItem<ResponseState["selectedPublisher"]>(
        "byblos-selectedPublisher",
        allStates.responseState.selectedPublisher,
      );
    } catch (error) {
      console.error(error);
    } finally {
      allDispatches.responseDispatch({
        type: allActions.responseActions.setAll,
        payload: { responseState: allStates.responseState },
      });
    }

    // navigate(`/home/displayVolume/${volume.customId}`);
  }

  return (
    <Fragment>
      <MyImageModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        src={modalSrc}
        alt={modalAlt}
      />
      <Flex gap="xl" direction="column">
        {volumes.length === 0
          ? localForageFallback.map((item) => (
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
                    <Link to={`/home/displayVolume/${item.customId}`}>
                      {item.volumeInfo.title}
                    </Link>
                  </Title>
                  {item.volumeInfo.authors?.map((author) => (
                    <Text key={author} style={{ cursor: "pointer" }}>
                      {author}
                    </Text>
                  ))}
                  <Text>
                    {Number.isNaN(
                      new Date(item.volumeInfo.publishedDate).getFullYear().toString(),
                    )
                      ? "Date unavailable"
                      : new Date(item.volumeInfo.publishedDate).getFullYear().toString()}
                  </Text>
                  <Spoiler
                    maxHeight={100}
                    showLabel="Show more"
                    hideLabel="Hide"
                    transitionDuration={382}
                  >
                    <Text>
                      {item.volumeInfo.description ?? "Description unavailable"}
                    </Text>
                  </Spoiler>
                </Grid.Col>
              </Grid>
            ))
          : volumes.map((item) => (
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
                    <Link to={`/home/displayVolume/${item.customId}`}>
                      {item.volumeInfo.title}
                    </Link>
                  </Title>
                  {item.volumeInfo.authors?.map((author) => (
                    <Text key={author} style={{ cursor: "pointer" }}>
                      {author}
                    </Text>
                  ))}
                  <Text>
                    {Number.isNaN(
                      new Date(item.volumeInfo.publishedDate).getFullYear().toString(),
                    )
                      ? "Date unavailable"
                      : new Date(item.volumeInfo.publishedDate).getFullYear().toString()}
                  </Text>
                  <Spoiler
                    maxHeight={100}
                    showLabel="Show more"
                    hideLabel="Hide"
                    transitionDuration={382}
                  >
                    <Text>
                      {item.volumeInfo.description ?? "Description unavailable"}
                    </Text>
                  </Spoiler>
                </Grid.Col>
              </Grid>
            ))}
      </Flex>
    </Fragment>
  );
}

export default DisplayGeneric;
