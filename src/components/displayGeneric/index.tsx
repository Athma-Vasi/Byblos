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
import { HiOutlineDocumentRemove } from "react-icons/hi";

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
import { defaultVolume } from "../localData";

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
  const { responseState, historyState } = allStates;
  const { responseDispatch, historyDispatch } = allDispatches;
  const { responseActions, historyActions } = allActions;

  const [localForageFallback, setLocalForageFallback] = useState<
    VolumeWithCustomId[]
  >([]);

  const [tempLocalBookshelf, setTempLocalBookshelf] = useState<UserBookshelf[]>(
    []
  );

  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();
  const { volumeId, page } = useParams();

  console.log(
    "allStates.responseState.searchResults?.items",
    allStates.responseState.searchResults?.items
  );

  const modifiedSearchResults = insertCustomId(
    allStates.responseState.searchResults?.items ?? localForageFallback
  );

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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'rating', in if block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'rating', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'rating', in else block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'rating', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
        }

        break;
      }

      case "markRead": {
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'markRead', in if block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'markRead', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'markRead', in else block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'markRead', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
        }

        break;
      }

      case "favourite": {
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'favourite', in if block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'favourite', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'favourite', in else block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'favourite', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
        }

        break;
      }

      case "readLater": {
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'readLater', in if block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'readLater', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
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

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'readLater', in else block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'readLater', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
        }

        break;
      }

      case "removeVolume": {
        const existingTempLocalBookshelfVolume = tempLocalBookshelfClone.find(
          (bookshelfVolume) => bookshelfVolume.id === localVolume.id
        );

        const idxOfExistingTempLocalBookshelfVolume =
          tempLocalBookshelfClone.findIndex(
            (bookshelfVolume) => bookshelfVolume.id === localVolume.id
          );

        if (existingTempLocalBookshelfVolume) {
          tempLocalBookshelfClone.splice(
            idxOfExistingTempLocalBookshelfVolume,
            1
          );

          setTempLocalBookshelf(tempLocalBookshelfClone);

          try {
            await localforage.setItem<UserBookshelf[]>(
              "byblos-userBookshelf",
              tempLocalBookshelfClone
            );

            navigate(
              `/home/displayResults/${allStates.responseState.activePage}`
            );
          } catch (error: any) {
            const error_ = new Error(error, {
              cause: "switch case 'removeVolume', in if block",
            });

            console.group(
              "Error in setting userBookshelf: switch case 'removeVolume', in localforage"
            );
            console.error("name: ", error_.name);
            console.error("message: ", error_.message);
            console.error("cause: ", error_.cause);
            console.groupCollapsed("stack trace");
            console.trace(error_);
            console.error("detailed stack trace", error_.stack);
            console.groupEnd();
          }
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
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "useEffect in displayGeneric",
        });

        console.group(
          "Error in displayGeneric useEffect fetchLocalStorageFallback(): "
        );
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchLocalStorageFallback();
  }, [allStates.responseState.activePage]);

  async function handleTitleClick(volume: VolumeWithCustomId) {
    allStates.responseState.activePage = 1;
    allStates.responseState.searchTerm = volume.volumeInfo.title;
    allStates.responseState.selectedVolume = volume;
    allStates.responseState.selectedAuthor =
      volume.volumeInfo.authors?.join(",") ?? "";
    allStates.responseState.selectedPublisher =
      volume.volumeInfo.publisher ?? "";

    //save the current state to history by pushing current responseState into the historyState stack
    historyDispatch({
      type: historyActions.pushHistory,
      payload: {
        historyState: {
          searchTerm: allStates.responseState.searchTerm,
          activePage: allStates.responseState.activePage,
          fetchUrl: allStates.responseState.fetchUrl,
          selectedVolume: allStates.responseState.selectedVolume,
          selectedAuthor: allStates.responseState.selectedAuthor,
          selectedPublisher: allStates.responseState.selectedPublisher,
          resultsPerPage: allStates.responseState.resultsPerPage,
          searchResults: allStates.responseState.searchResults,
        },
      },
    });

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
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleTitleClick in displayGeneric",
      });

      console.group("Error setting data to localforage");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
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
                  volume: defaultVolume, // will be undefined for this sample, all future volumes will not be undefined
                  rating: 5,
                  markRead: true,
                  favourite: true,
                  readLater: true,
                  dateAdded: new Date(),
                },
              ]
          );

        console.log(
          "IIFE initialUserBookshelf useEffect in displayGeneric",
          initialUserBookshelf
        );
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "useEffect in displayGeneric",
        });

        console.group("Error in displayGeneric generateUserBookshelf()");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
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
        {modifiedSearchResults.map((item) =>
          item.id === "aZ0YkIU0HusC" ? null : (
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
                          tempLocalBookshelf?.find(
                            (book) => book.id === item.id
                          )?.rating ?? 0
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
                            tempLocalBookshelf.find(
                              (book) => book.id === item.id
                            )?.favourite ?? false
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
                            tempLocalBookshelf.find(
                              (book) => book.id === item.id
                            )?.readLater ?? false
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
                            tempLocalBookshelf.find(
                              (book) => book.id === item.id
                            )?.markRead ?? false
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

                      <Text>Remove</Text>
                      <Button
                        variant="subtle"
                        disabled={
                          tempLocalBookshelf?.some(
                            (book) => book.id === item.id
                          )
                            ? false
                            : true
                        }
                        onClick={() => {
                          handleUserBookshelfAction(
                            "removeVolume",
                            item,
                            tempLocalBookshelf,
                            true
                          );
                        }}
                      >
                        <HiOutlineDocumentRemove size={20} />
                      </Button>
                    </Popover.Dropdown>
                  </Popover>
                </Center>
              </Grid.Col>
            </Grid>
          )
        )}
      </Flex>
    </Fragment>
  );
}

export default DisplayGeneric;
