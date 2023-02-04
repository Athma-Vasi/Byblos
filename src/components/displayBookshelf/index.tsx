import {
  Center,
  Grid,
  Space,
  Spoiler,
  Title,
  Image,
  Text,
} from "@mantine/core";
import localforage from "localforage";
import React, { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllStates,
  AllActions,
  AllDispatches,
  VolumeWithCustomId,
  ResponseState,
} from "../../types";
import DisplayGeneric from "../displayGeneric";
import { MyImageModal } from "../myImageModal";
import { MyPagination } from "../pagination";
import { Search } from "../search";

type DisplayBookshelfProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayBookshelf({
  allStates,
  allActions,
  allDispatches,
}: DisplayBookshelfProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  const { volumeId, page } = useParams();
  const { width = 0 } = useWindowSize();

  async function handleTitleClick(volume: VolumeWithCustomId) {
    allStates.responseState.activePage = 1;
    allStates.responseState.searchTerm = volume.volumeInfo.title;
    allStates.responseState.selectedVolume = volume;
    allStates.responseState.selectedAuthor =
      volume.volumeInfo.authors?.join(",") ?? "";
    allStates.responseState.selectedPublisher =
      volume.volumeInfo.publisher ?? "";

    try {
      await localforage.setItem<ResponseState["activePage"]>(
        "byblos-activePage",
        allStates.responseState.activePage
      );

      await localforage.setItem<ResponseState["searchTerm"]>(
        "byblos-searchTerm",
        allStates.responseState.searchTerm
      );

      await localforage.setItem<ResponseState["selectedVolume"]>(
        "byblos-selectedVolume",
        allStates.responseState.selectedVolume
      );

      await localforage.setItem<ResponseState["selectedAuthor"]>(
        "byblos-selectedAuthor",
        allStates.responseState.selectedAuthor
      );

      await localforage.setItem<ResponseState["selectedPublisher"]>(
        "byblos-selectedPublisher",
        allStates.responseState.selectedPublisher
      );
    } catch (error) {
      console.error("Error in displayGeneric handleTitleClick(): ", error);
    } finally {
      allDispatches.responseDispatch({
        type: allActions.responseActions.setAll,
        payload: { responseState: allStates.responseState },
      });

      window.scrollTo(0, 0);
    }
  }

  return (
    <Fragment>
      <MyImageModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        src={modalSrc}
        alt={modalAlt}
      />
      {allStates.responseState.searchResults?.items?.map((item) => (
        <Grid key={item.id} columns={9}>
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
          <Grid.Col span={width < 992 ? 6 : 7}>
            <Title
              order={3}
              onClick={() => {
                handleTitleClick(item as VolumeWithCustomId);
              }}
            >
              <Link to={`/home/displayVolume/${item.id}`}>
                {item.volumeInfo.title}
              </Link>
            </Title>
            {item.volumeInfo.authors
              ?.join(",:")
              .split(":")
              .map((author) => (
                <span key={author}>{author} </span>
              ))}
            <Text>
              {Number.isNaN(
                new Date(item.volumeInfo.publishedDate).getFullYear().toString()
              )
                ? "Date unavailable"
                : new Date(item.volumeInfo.publishedDate)
                    .getFullYear()
                    .toString()}
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

      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}

      <MyPagination
        parentPath="/home/displayBookshelf/"
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default DisplayBookshelf;
