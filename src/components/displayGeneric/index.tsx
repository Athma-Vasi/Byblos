import {
  Button,
  Center,
  Flex,
  Grid,
  Highlight,
  HoverCard,
  Image,
  Popover,
  Rating,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  MdOutlineFavorite,
  MdOutlineFavoriteBorder,
  MdOutlineWatchLater,
  MdWatchLater,
} from "react-icons/md";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  RatingAction,
  ResponseState,
  UserBookshelf,
  UserBookshelfActions,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import { MyImageModal } from "../myImageModal";
import {
  IoMdCheckmarkCircle,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { GrFavorite } from "react-icons/gr";
import MyRating from "../myRating";
import { v4 as uuidv4 } from "uuid";

type DisplayGenericProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
  // volumes: VolumeWithCustomId[];
};

function DisplayGeneric({
  children,
  // volumes,
  allStates,
  allActions,
  allDispatches,
}: DisplayGenericProps) {
  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();
  const { volumeId, page } = useParams();

  const [localForageFallback, setLocalForageFallback] = useState<
    VolumeWithCustomId[]
  >([]);

  const [tempLocalBookshelf, setTempLocalBookshelf] = useState<UserBookshelf[]>(
    [
      {
        // sample data upon first initialization if no data is found in localforage
        name: "Mirror Dance",
        id: uuidv4(), // future actual ids are the server generated google books id
        volume: localForageFallback[0], // will be undefined for this sample, all future volumes will not be undefined
        rating: 5,
        markRead: true,
        favourite: true,
        readLater: true,
        dateAdded: new Date(),
      },
    ]
  );

  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  async function handleUserBookshelfAction(
    kind: UserBookshelfActions,
    localVolume: VolumeWithCustomId,
    tempLocalBookshelf: UserBookshelf[],
    value: RatingAction | boolean
  ) {
    const tempLocalBookshelfClone = structuredClone(tempLocalBookshelf);

    switch (kind) {
      case "rating": {
        const existingTempLocalBookshelfVolume = tempLocalBookshelfClone.find(
          (bookshelfVolume) => bookshelfVolume.id === localVolume.id
        );

        const idxOfExistingTempLocalBookshelfVolume =
          tempLocalBookshelfClone.findIndex(
            (bookshelfVolume) => bookshelfVolume.id === localVolume.id
          );

        if (existingTempLocalBookshelfVolume) {
          existingTempLocalBookshelfVolume.rating = value as RatingAction;

          tempLocalBookshelfClone.splice(
            idxOfExistingTempLocalBookshelfVolume,
            1,
            existingTempLocalBookshelfVolume
          );

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );
        } else {
          tempLocalBookshelfClone.push({
            name: localVolume.volumeInfo.title,
            id: localVolume.id,
            volume: localVolume,
            rating: value as RatingAction,
            markRead: false,
            favourite: false,
            readLater: false,
            dateAdded: new Date(),
          });

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );

          console.log(
            "rating added to userBookshelf in localforage",
            tempLocalBookshelfClone
          );
        }

        break;
      }

      case "markRead": {
        console.log("value of markedRead inside switch: ", value);

        const existingTempLocalBookshelfVolume = tempLocalBookshelfClone.find(
          (bookshelfVolume) => bookshelfVolume.id === localVolume.id
        );

        const idxOfExistingTempLocalBookshelfVolume =
          tempLocalBookshelfClone.findIndex(
            (bookshelfVolume) => bookshelfVolume.id === localVolume.id
          );

        if (existingTempLocalBookshelfVolume) {
          existingTempLocalBookshelfVolume.markRead = !value as boolean;

          tempLocalBookshelfClone.splice(
            idxOfExistingTempLocalBookshelfVolume,
            1,
            existingTempLocalBookshelfVolume
          );

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );
        } else {
          tempLocalBookshelfClone.push({
            name: localVolume.volumeInfo.title,
            id: localVolume.id,
            volume: localVolume,
            rating: 0,
            markRead: !value as boolean,
            favourite: false,
            readLater: false,
            dateAdded: new Date(),
          });

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );

          console.log(
            "markRead added to userBookshelf in localforage",
            tempLocalBookshelfClone
          );
        }

        break;
      }

      case "favourite": {
        console.log("value of favourite inside switch: ", value);

        const existingTempLocalBookshelfVolume = tempLocalBookshelfClone.find(
          (bookshelfVolume) => bookshelfVolume.id === localVolume.id
        );

        const idxOfExistingTempLocalBookshelfVolume =
          tempLocalBookshelfClone.findIndex(
            (bookshelfVolume) => bookshelfVolume.id === localVolume.id
          );

        if (existingTempLocalBookshelfVolume) {
          existingTempLocalBookshelfVolume.favourite = !value as boolean;

          tempLocalBookshelfClone.splice(
            idxOfExistingTempLocalBookshelfVolume,
            1,
            existingTempLocalBookshelfVolume
          );

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );
        } else {
          tempLocalBookshelfClone.push({
            name: localVolume.volumeInfo.title,
            id: localVolume.id,
            volume: localVolume,
            rating: 0,
            markRead: false,
            favourite: !value as boolean,
            readLater: false,
            dateAdded: new Date(),
          });

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );

          console.log(
            "favourite added to userBookshelf in localforage",
            tempLocalBookshelfClone
          );
        }

        break;
      }

      case "readLater": {
        console.log("value of readLater inside switch: ", value);

        const existingTempLocalBookshelfVolume = tempLocalBookshelfClone.find(
          (bookshelfVolume) => bookshelfVolume.id === localVolume.id
        );

        const idxOfExistingTempLocalBookshelfVolume =
          tempLocalBookshelfClone.findIndex(
            (bookshelfVolume) => bookshelfVolume.id === localVolume.id
          );

        if (existingTempLocalBookshelfVolume) {
          existingTempLocalBookshelfVolume.readLater = !value as boolean;

          tempLocalBookshelfClone.splice(
            idxOfExistingTempLocalBookshelfVolume,
            1,
            existingTempLocalBookshelfVolume
          );

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );
        } else {
          tempLocalBookshelfClone.push({
            name: localVolume.volumeInfo.title,
            id: localVolume.id,
            volume: localVolume,
            rating: 0,
            markRead: false,
            favourite: false,
            readLater: !value as boolean,
            dateAdded: new Date(),
          });

          setTempLocalBookshelf(tempLocalBookshelfClone);

          await localforage.setItem<UserBookshelf[]>(
            "byblos-userBookshelf",
            tempLocalBookshelfClone
          );

          console.log(
            "readLater added to userBookshelf in localforage",
            tempLocalBookshelfClone
          );
        }

        break;
      }

      default:
        break;
    }
  }

  useEffect(() => {
    const fetchLocalStorageFallback = async () => {
      try {
        const value = await localforage.getItem<ResponseState["searchResults"]>(
          "byblos-searchResults"
        );
        if (value) {
          setLocalForageFallback(insertCustomId(value?.items ?? []));
        }

        console.log(
          "localForageFallback useEffect in displayGeneric",
          localForageFallback
        );
      } catch (error) {
        console.error(
          "Error in displayGeneric useEffect  fetchLocalStorageFallback(): ",
          error
        );
      }
    };

    fetchLocalStorageFallback();
  }, [allStates.responseState.activePage]);

  const modifiedSearchResults = insertCustomId(
    allStates.responseState.searchResults?.items ?? localForageFallback
  );

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

  useEffect(() => {
    (async function generateUserBookshelf() {
      let initialUserBookshelf: UserBookshelf[] = [];
      try {
        initialUserBookshelf = await localforage
          .getItem<UserBookshelf[]>("byblos-userBookshelf")
          .then(
            (value) =>
              value ?? [
                {
                  // sample data upon first initialization if no data is found in localforage
                  name: "Mirror Dance",
                  id: uuidv4(), // future actual ids are the server generated google books id
                  volume: localForageFallback[0], // will be undefined for this sample, all future volumes will not be undefined
                  rating: 5,
                  markRead: true,
                  favourite: true,
                  readLater: true,
                  dateAdded: new Date(),
                },
              ]
          );
      } catch (error) {
        console.error(
          "Error in displayGeneric generateUserBookshelf(): ",
          error
        );
      }
      return initialUserBookshelf;
    })().then((value) => {
      //initial bookshelf value is set here
      //tempLocalBookshelf's initial value is replaced upon initialization to avoid having to set null initially
      setTempLocalBookshelf(value);

      console.log("tempLocalBookshelf useEffect in displayGeneric", value);
    });
  }, []);

  return (
    <Fragment>
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
            <Grid.Col span={width < 992 ? 6 : 7}>
              <Title
                order={3}
                onClick={() => {
                  handleTitleClick(item);
                }}
              >
                <Link to={`/home/displayVolume/${item.customId}`}>
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
                  new Date(item.volumeInfo.publishedDate)
                    .getFullYear()
                    .toString()
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

            <Grid.Col span={1}>
              <Center>
                <Popover width={300} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <Button variant="subtle">
                      <BsThreeDotsVertical size={20} />
                    </Button>
                  </Popover.Target>
                  {/* ratings popover */}
                  <Popover.Dropdown>
                    <Text>Rate</Text>
                    <MyRating
                      value={
                        tempLocalBookshelf?.find((book) => book.id === item.id)
                          ?.rating ?? 0
                      }
                      onChange={(value) =>
                        handleUserBookshelfAction(
                          "rating",
                          item,
                          tempLocalBookshelf,
                          value
                        )
                      }
                    />

                    <Text>Favourite</Text>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        handleUserBookshelfAction(
                          "favourite",
                          item,
                          tempLocalBookshelf,
                          tempLocalBookshelf.find((book) => book.id === item.id)
                            ?.favourite ?? false
                        );
                      }}
                    >
                      {tempLocalBookshelf?.find((book) => book.id === item.id)
                        ?.favourite ? (
                        <MdOutlineFavorite size={20} />
                      ) : (
                        <MdOutlineFavoriteBorder size={20} />
                      )}
                    </Button>

                    <Text>Read later</Text>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        handleUserBookshelfAction(
                          "readLater",
                          item,
                          tempLocalBookshelf,
                          tempLocalBookshelf.find((book) => book.id === item.id)
                            ?.readLater ?? false
                        );
                      }}
                    >
                      {tempLocalBookshelf?.find((book) => book.id === item.id)
                        ?.readLater ? (
                        <MdWatchLater size={20} />
                      ) : (
                        <MdOutlineWatchLater size={20} />
                      )}
                    </Button>

                    <Text>Mark read</Text>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        handleUserBookshelfAction(
                          "markRead",
                          item,
                          tempLocalBookshelf,
                          tempLocalBookshelf.find((book) => book.id === item.id)
                            ?.markRead ?? false
                        );
                      }}
                    >
                      {tempLocalBookshelf?.find((book) => book.id === item.id)
                        ?.markRead ? (
                        <IoMdCheckmarkCircle size={20} />
                      ) : (
                        <IoMdCheckmarkCircleOutline size={20} />
                      )}
                    </Button>
                  </Popover.Dropdown>
                </Popover>
              </Center>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
    </Fragment>
  );
}

export default DisplayGeneric;
