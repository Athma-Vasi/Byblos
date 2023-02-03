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
  MdFavorite,
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
  ResponseState,
  UserBookshelf,
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

  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isToRead, setIsToRead] = useState(false);
  const [userRatedVolume, setUserRatedVolume] = useState<VolumeWithCustomId>(
    //will be initialized as undefined and replaced with user selected volume
    localForageFallback[0]
  );

  console.log("rating", rating);
  console.log("isFavorite", isFavorite);
  console.log("isRead", isRead);
  console.log("isToRead", isToRead);
  console.log("userRatedVolume", userRatedVolume);

  useEffect(() => {
    const storeUsersVolumeInBookshelf = async () => {
      try {
        const userBookshelf: UserBookshelf[] = (await localforage.getItem<
          UserBookshelf[]
        >("byblos-userBookshelf")) ?? [
          {
            name: "Mirror Dance",
            volumeId: uuidv4(),
            volume: localForageFallback[0],
            rating: 5,
            favorite: true,
            markRead: true,
            readLater: false,
            dateAdded: new Date().toISOString(),
          },
        ];

        console.log("userBookshelf", userBookshelf);
        console.log(
          "dateAdded",
          new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          }).format(new Date(userBookshelf[0].dateAdded))
        );
      } catch (error) {
        console.error(
          "Error in displayGeneric storeUsersVolumeInBookshelf(): ",
          error
        );
      }
    };

    storeUsersVolumeInBookshelf();
  }, [rating, isFavorite, isRead, isToRead]);

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
                style={{ cursor: "pointer" }}
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
                      value={rating}
                      onChange={(value) => {
                        setRating(value);
                        setUserRatedVolume(item);
                      }}
                    />

                    <Text>Favourite</Text>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setIsFavorite((prev) => !prev);
                        setUserRatedVolume(item);
                      }}
                    >
                      {isFavorite ? (
                        <MdOutlineFavorite size={20} />
                      ) : (
                        <MdOutlineFavoriteBorder size={20} />
                      )}
                    </Button>

                    <Text>Read later</Text>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setIsToRead((prev) => !prev);
                        setUserRatedVolume(item);
                      }}
                    >
                      {isToRead ? (
                        <MdWatchLater size={20} />
                      ) : (
                        <MdOutlineWatchLater size={20} />
                      )}
                    </Button>

                    <Text>Mark read</Text>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setIsRead(!isRead);
                        setUserRatedVolume(item);
                      }}
                    >
                      {isRead ? (
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
