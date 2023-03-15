import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Image,
  Popover,
  Space,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  HistoryState,
  NavlinksState,
  NavlinksStateActionDispatch,
  RatingAction,
  ResponseState,
  ThemeState,
  UserBookshelf,
  UserBookshelfActions,
  VolumeWithCustomId,
} from "../../types";
import {
  insertCustomId,
  toggleCurrentlyActiveNavlink,
  upgradeLinksToHttps,
} from "../../utils";
import { MyImageModal } from "../myImageModal";
import {
  IoMdCheckmarkCircle,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import MyRating from "../myRating";
import { v4 as uuidv4 } from "uuid";
import { defaultVolume } from "../../localData";

type DisplayGenericProps = {
  children?: React.ReactNode;
  themeState: ThemeState;
  responseState: ResponseState;
  navlinksState: NavlinksState;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayGeneric({
  themeState,
  responseState,
  navlinksState,
  allActions,
  allDispatches,
}: DisplayGenericProps) {
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
  const { volumeId, page } = useParams();

  let {
    fetchUrl,
    startIndex,
    searchTerm,
    searchResults,
    selectedVolume,
    selectedAuthor,
    selectedPublisher,
    bookshelfVolumes,
  } = responseState;
  let { theme } = themeState;
  let { responseDispatch, navlinksDispatch } = allDispatches;
  let {
    responseActions: { setAll },
    navlinksActions,
  } = allActions;

  //inserts custom id into searchResults for rendering as google api id may
  //not be unique
  let modifiedSearchResults = insertCustomId(
    searchResults?.items ?? localForageFallback
  );

  modifiedSearchResults = upgradeLinksToHttps(modifiedSearchResults);

  const navlinksStateActionDispatch: NavlinksStateActionDispatch = {
    navlinksState,
    navlinksActions,
    navlinksDispatch,
  };

  /**
   * much of the functionality of this component is similar to that of displayBookshelf plus the infinite scroll
   */

  async function handleUserBookshelfAction(
    kind: UserBookshelfActions,
    localVolume: VolumeWithCustomId,
    tempLocalBookshelf: UserBookshelf[],
    value: RatingAction | boolean
  ) {
    //tempLocalBookshelf is used to manage state of user actions of the volumes
    //in the bookshelf before they are saved to localforage
    //also used to display the correct icon state of the volume
    const tempLocalBookshelfClone = structuredClone(tempLocalBookshelf);

    //logic inside switch cases are similar
    //1. check if volume is already in tempLocalBookshelf state
    //2. if true, update the state and store in localforage
    //3. else false, add the volume to tempLocalBookshelf state and store in localforage

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

  //fallback used when state passed from searchResults is undefined
  useEffect(() => {
    const fetchLocalStorageFallback = async () => {
      try {
        const value = await localforage.getItem<ResponseState["searchResults"]>(
          "byblos-searchResults"
        );
        if (value) {
          setLocalForageFallback(insertCustomId(value?.items ?? []));
        }
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "fetchLocalStorageFallback()",
        });

        console.group("Error in displayGeneric useEffect");
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
  }, []);

  async function handleTitleClick(
    volume: VolumeWithCustomId,
    navlinksStateActionDispatch: NavlinksStateActionDispatch
  ) {
    let { navlinksState, navlinksActions, navlinksDispatch } =
      navlinksStateActionDispatch;

    //sets currently active navlink and all other navlinks to false
    toggleCurrentlyActiveNavlink(
      navlinksState,
      navlinksActions,
      navlinksDispatch
    );

    //response state values are updated
    startIndex = 0;
    searchTerm = volume.volumeInfo.title;
    selectedVolume = volume;
    selectedAuthor = volume.volumeInfo.authors?.join(",") ?? "";
    selectedPublisher = volume.volumeInfo.publisher ?? "";

    //localforage values are updated with the new response state values
    try {
      await localforage.setItem<ResponseState["startIndex"]>(
        "byblos-startIndex",
        startIndex
      );

      await localforage.setItem<ResponseState["searchTerm"]>(
        "byblos-searchTerm",
        searchTerm
      );

      await localforage.setItem<ResponseState["selectedVolume"]>(
        "byblos-selectedVolume",
        selectedVolume
      );

      await localforage.setItem<ResponseState["selectedAuthor"]>(
        "byblos-selectedAuthor",
        selectedAuthor
      );

      await localforage.setItem<ResponseState["selectedPublisher"]>(
        "byblos-selectedPublisher",
        selectedPublisher
      );

      //history state is updated whenever a title is clicked
      //the history state is an array of objects, each object representing the state of the app at a particular point in time
      //mainly used for the back button so the user does not see results of currently selected volume when they click the back button
      const historyStateLocalForage = (await localforage.getItem<HistoryState>(
        "byblos-historyState"
      )) ?? [
        {
          fetchUrl,
          startIndex,
          searchTerm,
          searchResults,
          selectedVolume,
          selectedAuthor,
          selectedPublisher,
          bookshelfVolumes,
        },
      ];

      historyStateLocalForage.push({
        fetchUrl,
        startIndex,
        searchTerm,
        searchResults,
        selectedVolume,
        selectedAuthor,
        selectedPublisher,
        bookshelfVolumes,
      });

      await localforage.setItem<HistoryState>(
        "byblos-historyState",
        historyStateLocalForage
      );
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleTitleClick()",
      });

      console.group("Error in displayGeneric eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    } finally {
      responseDispatch({
        type: setAll,
        payload: {
          responseState: {
            fetchUrl,
            startIndex,
            searchTerm,
            searchResults,
            selectedVolume,
            selectedAuthor,
            selectedPublisher,
            bookshelfVolumes,
          },
        },
      });

      window.scrollTo(0, 0);
    }
  }

  useEffect(() => {
    //IIFE to generate userBookshelf[] if it does not exist in localforage
    //and to set the tempLocalBookshelf state to the userBookshelf[]
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
                  //user does not see this volume rendered
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
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "generateUserBookshelf()",
        });

        console.group("Error in displayGeneric useEffect");
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
        {modifiedSearchResults.length === 0 ? (
          <Container>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Flex direction="column" align="center" justify="center">
                <Text color={theme === "light" ? "dark.5" : "gray.5"}>
                  There seems to be nothing here.
                </Text>
                <Space h="md" />
                <Text
                  color={theme === "light" ? "brand.4" : "brand.8"}
                  size={28}
                >
                  (｡•́︿•̀｡)
                </Text>
              </Flex>
            </Card>
          </Container>
        ) : null}
        {modifiedSearchResults.map((item) =>
          // prevents default volume from being rendered
          item.id === "aZ0YkIU0HusC" ? null : (
            <Card
              shadow="sm"
              p={width < 576 ? "xs" : "md"}
              radius="md"
              withBorder
              key={item.customId}
              style={{ minHeight: "325px" }}
            >
              <Grid key={item.customId} columns={9}>
                {/* image column */}
                <Grid.Col span={width < 992 ? 2 : 1}>
                  <Flex
                    style={{
                      width: "100%",
                      height: "100%",
                      minWidth: "50px",
                    }}
                    direction="column"
                    justify="center"
                    align="center"
                  >
                    <Image
                      style={{ cursor: "pointer" }}
                      src={item.volumeInfo.imageLinks?.thumbnail}
                      alt={``}
                      onClick={() => {
                        setModalSrc(
                          item.volumeInfo.imageLinks?.thumbnail ?? ""
                        );
                        setModalAlt(item.volumeInfo.title);
                        setModalOpened(true);
                      }}
                      withPlaceholder
                      placeholder={
                        <Text align="center">No image available</Text>
                      }
                      radius="xs"
                      data-cy="image-thumbnail"
                    />
                  </Flex>
                </Grid.Col>

                {/* description column */}
                <Grid.Col span={width < 992 ? 7 : 8}>
                  {/* title and popover */}
                  <Flex align="center" justify="space-between">
                    {/* title */}
                    <Title
                      order={3}
                      onClick={() => {
                        handleTitleClick(item, navlinksStateActionDispatch);
                      }}
                      data-cy="title-volume"
                      style={{ paddingBottom: "3px" }}
                      color={theme === "light" ? "dark.5" : "gray.4"}
                    >
                      <Link
                        to={`/home/displayVolume/${item.customId}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {item.volumeInfo.title}
                      </Link>
                    </Title>

                    <Flex>
                      {/* popover */}
                      <Popover
                        width={300}
                        position={width < 576 ? "bottom" : "left"}
                        withArrow
                        shadow="xl"
                        radius="md"
                      >
                        <Popover.Target>
                          <Button
                            variant={width < 576 ? "light" : "subtle"}
                            radius="lg"
                            data-cy="dropdownIcon-volume"
                          >
                            <BsThreeDotsVertical size={20} />
                          </Button>
                        </Popover.Target>
                        {/* ratings popover */}
                        <Popover.Dropdown>
                          <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            gap="sm"
                            data-cy="dropdownMenu-volume"
                          >
                            <Flex
                              direction="row"
                              align="center"
                              justify="space-between"
                              style={{
                                width: "100%",
                              }}
                            >
                              <Text
                                size={width < 576 ? "sm" : "md"}
                                color={theme === "light" ? "dark.5" : "gray.5"}
                                data-cy="rate-dropDownMenu"
                              >
                                Rate
                              </Text>
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
                            </Flex>

                            <Flex
                              direction="row"
                              align="center"
                              justify="space-between"
                              style={{
                                width: "100%",
                              }}
                            >
                              <Text
                                size={width < 576 ? "sm" : "md"}
                                color={theme === "light" ? "dark.5" : "gray.5"}
                                data-cy="favourite-dropDownMenu"
                              >
                                Favourite
                              </Text>
                              <Button
                                variant={width < 576 ? "light" : "subtle"}
                                radius="lg"
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
                                {tempLocalBookshelf?.find(
                                  (book) => book.id === item.id
                                )?.favourite ? (
                                  <MdOutlineFavorite size={20} />
                                ) : (
                                  <MdOutlineFavoriteBorder size={20} />
                                )}
                              </Button>
                            </Flex>

                            <Flex
                              direction="row"
                              align="center"
                              justify="space-between"
                              style={{
                                width: "100%",
                              }}
                            >
                              <Text
                                size={width < 576 ? "sm" : "md"}
                                color={theme === "light" ? "dark.5" : "gray.5"}
                                data-cy="readLater-dropDownMenu"
                              >
                                Read later
                              </Text>
                              <Button
                                variant={width < 576 ? "light" : "subtle"}
                                radius="lg"
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
                                {tempLocalBookshelf?.find(
                                  (book) => book.id === item.id
                                )?.readLater ? (
                                  <MdWatchLater size={20} />
                                ) : (
                                  <MdOutlineWatchLater size={20} />
                                )}
                              </Button>
                            </Flex>

                            <Flex
                              direction="row"
                              align="center"
                              justify="space-between"
                              style={{
                                width: "100%",
                              }}
                            >
                              <Text
                                size={width < 576 ? "sm" : "md"}
                                color={theme === "light" ? "dark.5" : "gray.5"}
                                data-cy="markRead-dropDownMenu"
                              >
                                Mark read
                              </Text>
                              <Button
                                variant={width < 576 ? "light" : "subtle"}
                                radius="lg"
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
                                {tempLocalBookshelf?.find(
                                  (book) => book.id === item.id
                                )?.markRead ? (
                                  <IoMdCheckmarkCircle size={20} />
                                ) : (
                                  <IoMdCheckmarkCircleOutline size={20} />
                                )}
                              </Button>
                            </Flex>

                            <Flex
                              direction="row"
                              align="center"
                              justify="space-between"
                              style={{
                                width: "100%",
                              }}
                            >
                              <Text
                                size={width < 576 ? "sm" : "md"}
                                color={theme === "light" ? "dark.5" : "gray.5"}
                                data-cy="remove-dropDownMenu"
                              >
                                Remove
                              </Text>
                              <Button
                                variant={width < 576 ? "light" : "subtle"}
                                radius="lg"
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
                            </Flex>
                          </Flex>
                        </Popover.Dropdown>
                      </Popover>
                    </Flex>
                  </Flex>

                  {item.volumeInfo.authors
                    ?.join(",:")
                    .split(":")
                    .map((author) => (
                      <Text
                        style={{ display: "inline" }}
                        color={theme === "light" ? "dark.5" : "gray.4"}
                        key={author}
                        data-cy="author-volume"
                        size={width < 576 ? "lg" : "md"}
                      >
                        {author}{" "}
                      </Text>
                    ))}

                  <Text
                    style={{ paddingTop: "3px", paddingBottom: "3px" }}
                    color={theme === "light" ? "dark.5" : "gray.5"}
                    data-cy="publishedYear-volume"
                    size={"md"}
                  >
                    {Number.isNaN(
                      new Date(item.volumeInfo.publishedDate)
                        .getFullYear()
                        .toString()
                    )
                      ? "Date unavailable"
                      : new Date(item.volumeInfo.publishedDate)
                          .getFullYear()
                          .toString() === "NaN"
                      ? "Date unavailable"
                      : new Date(item.volumeInfo.publishedDate).getFullYear()}
                  </Text>

                  <Spoiler
                    maxHeight={width < 576 ? 174 : 178}
                    data-cy="spoiler-volume"
                    showLabel={
                      width < 576 ? (
                        <Button radius="md" variant="light">
                          <Text size={width < 576 ? "sm" : "md"}>
                            ⬇ Show more
                          </Text>
                        </Button>
                      ) : (
                        <Text size={width < 576 ? "sm" : "md"} weight="bold">
                          ⬇ Show more
                        </Text>
                      )
                    }
                    hideLabel={
                      width < 576 ? (
                        <Button radius="md" variant="light">
                          <Text size={width < 576 ? "sm" : "md"}>⬆ Hide</Text>
                        </Button>
                      ) : (
                        <Text size={width < 576 ? "sm" : "md"} weight="bold">
                          ⬆ Hide
                        </Text>
                      )
                    }
                    transitionDuration={382}
                  >
                    <Text
                      color={theme === "light" ? "dark.5" : "gray.5"}
                      data-cy="description-volume"
                      size="md"
                    >
                      {item.volumeInfo.description ?? "Description unavailable"}
                    </Text>
                  </Spoiler>
                </Grid.Col>
              </Grid>
            </Card>
          )
        )}
      </Flex>
      <Space h="xl" />
    </Fragment>
  );
}

export default DisplayGeneric;
