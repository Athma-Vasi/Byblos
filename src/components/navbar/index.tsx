import { Navbar, NavLink, Space } from "@mantine/core";
import { TbChevronsRight, TbChevronRight } from "react-icons/tb";
import { BsBookshelf } from "react-icons/bs";
import { GiBlackBook, GiBookshelf, GiStarsStack } from "react-icons/gi";
import {
  RiDeleteBin6Line,
  RiHealthBookFill,
  RiHomeHeartLine,
} from "react-icons/ri";
import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  UserBookshelf,
  VolumeWithCustomId,
} from "../../types";
import localforage from "localforage";
import { Link } from "react-router-dom";

type MyNavBarProps = {
  children?: React.ReactNode;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyNavBar({
  opened,
  setOpened,
  allStates,
  allActions,
  allDispatches,
}: MyNavBarProps) {
  let {
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
    themeState: { theme },
    navlinksState: {
      isMyLibraryActive,
      isBookshelfActive,
      isFavouritesActive,
      isRatedActive,
      isMarkReadActive,
      isReadLaterActive,
    },
  } = allStates;
  let { responseDispatch, navlinksDispatch } = allDispatches;
  let {
    responseActions: { setBookshelfVolumes },
    navlinksActions: {
      setIsMyLibraryActive,
      setIsBookshelfActive,
      setIsFavouritesActive,
      setIsRatedActive,
      setIsMarkReadActive,
      setIsReadLaterActive,
    },
  } = allActions;

  async function handleParentNavlinkClick() {
    navlinksDispatch({
      type: setIsMyLibraryActive,
    });

    //history state is updated whenever the user clicks on a navlink
    //the history state is an array of objects, each object representing the state of the app at a particular point in time
    //mainly used for the back button so the user does not see results of currently selected volume when they click the back button
    try {
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
        cause: "handleParentNavlinkClick()",
      });

      console.group("Error in navbar eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  async function handleChildNavlinksClick(navLinkKind: string) {
    //set opened to close the navbar
    setOpened(false);

    //navigate to top of page
    window.scrollTo(0, 0);

    switch (navLinkKind) {
      case "bookshelf": {
        navlinksDispatch({
          type: setIsBookshelfActive,
        });

        break;
      }
      case "rated": {
        navlinksDispatch({
          type: setIsRatedActive,
        });

        break;
      }

      case "favourites": {
        navlinksDispatch({
          type: setIsFavouritesActive,
        });

        break;
      }

      case "markRead": {
        navlinksDispatch({
          type: setIsMarkReadActive,
        });

        break;
      }

      case "readLater": {
        navlinksDispatch({
          type: setIsReadLaterActive,
        });

        break;
      }

      default:
        break;
    }

    try {
      //grab the userBookshelf from localforage
      const userBookshelf = await localforage.getItem<UserBookshelf[]>(
        "byblos-userBookshelf"
      );

      const userBookshelfClone = structuredClone(userBookshelf);

      switch (navLinkKind) {
        case "bookshelf": {
          //grab all the volumes from the userBookshelf
          const volumes = userBookshelfClone?.map((item) => item.volume);

          responseDispatch({
            type: setBookshelfVolumes,
            payload: {
              responseState: {
                fetchUrl,
                startIndex,
                searchTerm,
                searchResults,
                selectedVolume,
                selectedAuthor,
                selectedPublisher,
                bookshelfVolumes: volumes ?? [],
              },
            },
          });

          break;
        }

        case "rated": {
          //grab just the rated volumes from the userBookshelf
          const ratedVolumes = userBookshelfClone?.reduce(
            (volumes: VolumeWithCustomId[], item: UserBookshelf) => {
              item.rating && volumes.push(item.volume);

              return volumes;
            },
            []
          );

          responseDispatch({
            type: setBookshelfVolumes,
            payload: {
              responseState: {
                fetchUrl,
                startIndex,
                searchTerm,
                searchResults,
                selectedVolume,
                selectedAuthor,
                selectedPublisher,
                bookshelfVolumes: ratedVolumes ?? [],
              },
            },
          });

          break;
        }

        case "favourites": {
          //grab just the favourited volumes from the userBookshelf
          const favouriteVolumes = userBookshelfClone?.reduce(
            (volumes: VolumeWithCustomId[], item: UserBookshelf) => {
              item.favourite && volumes.push(item.volume);

              return volumes;
            },
            []
          );

          responseDispatch({
            type: setBookshelfVolumes,
            payload: {
              responseState: {
                fetchUrl,
                startIndex,
                searchTerm,
                searchResults,
                selectedVolume,
                selectedAuthor,
                selectedPublisher,
                bookshelfVolumes: favouriteVolumes ?? [],
              },
            },
          });

          break;
        }

        case "markRead": {
          //grab just the marked read volumes from the userBookshelf
          const markReadVolumes = userBookshelfClone?.reduce(
            (volumes: VolumeWithCustomId[], item: UserBookshelf) => {
              item.markRead && volumes.push(item.volume);

              return volumes;
            },
            []
          );

          responseDispatch({
            type: setBookshelfVolumes,
            payload: {
              responseState: {
                fetchUrl,
                startIndex,
                searchTerm,
                searchResults,
                selectedVolume,
                selectedAuthor,
                selectedPublisher,
                bookshelfVolumes: markReadVolumes ?? [],
              },
            },
          });

          break;
        }

        case "readLater": {
          //grab just the readLater volumes from the userBookshelf
          const readLaterVolumes = userBookshelfClone?.reduce(
            (volumes: VolumeWithCustomId[], item: UserBookshelf) => {
              item.readLater && volumes.push(item.volume);

              return volumes;
            },
            []
          );

          responseDispatch({
            type: setBookshelfVolumes,
            payload: {
              responseState: {
                fetchUrl,
                startIndex,
                searchTerm,
                searchResults,
                selectedVolume,
                selectedAuthor,
                selectedPublisher,
                bookshelfVolumes: readLaterVolumes ?? [],
              },
            },
          });

          break;
        }
      }
    } catch (error: any) {
      const error_ = new Error(error, { cause: "handleChildNavlinksClick()" });

      console.group("Error in navbar component");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack", error_.stack);
      console.groupEnd();
    }
  }

  async function handleClearStorageNavlinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const userDecision = window.confirm(
      `Are you sure you want to clear your bookshelf from this device? This action cannot be undone.`
    );

    try {
      if (!userDecision) return;

      //remove responseState localforage items
      const localforageKeysArr = [
        await localforage.removeItem("byblos-fetchUrl"),
        await localforage.removeItem("byblos-startIndex"),
        await localforage.removeItem("byblos-searchTerm"),
        await localforage.removeItem("byblos-searchResults"),
        await localforage.removeItem("byblos-selectedVolume"),
        await localforage.removeItem("byblos-selectedAuthor"),
        await localforage.removeItem("byblos-selectedPublisher"),
        await localforage.removeItem("byblos-bookshelfVolumes"),
        await localforage.removeItem("byblos-userBookshelf"),
        await localforage.removeItem("byblos-historyState"),
      ];

      Promise.all(localforageKeysArr).then(() => {
        window.alert("Your bookshelf has been cleared from this device.");
      });
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleClearStorageNavlinkClick()",
      });

      console.group("Error in navbar eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack", error_.stack);
      console.groupEnd();
    }
  }

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      color={theme === "light" ? "dark.6" : "gray.5"}
      data-cy="navbar"
    >
      <NavLink
        label="My Library"
        active={isMyLibraryActive}
        onClick={handleParentNavlinkClick}
        icon={
          <BsBookshelf
            size={20}
            style={{
              color: `${theme === "light" ? "#B06519" : "#B87333"}`,
            }}
          />
        }
        rightSection={
          <TbChevronsRight
            size={20}
            style={{
              color: `${theme === "light" ? "#B06519" : "#B87333"}`,
            }}
          />
        }
        variant="subtle"
        childrenOffset={28}
        data-cy="navlink-myLibrary"
      >
        <Space h="sm" />

        <Link
          to={`/home/displayBookshelf`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <NavLink
            label="Bookshelf"
            icon={
              <GiBookshelf
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            active={isBookshelfActive}
            rightSection={
              <TbChevronRight
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            onClick={() => handleChildNavlinksClick("bookshelf")}
            variant="subtle"
            data-cy="navlink-bookshelf"
          />
        </Link>

        <Space h="sm" />

        <Link
          to={`/home/displayBookshelf`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <NavLink
            label="Favourites"
            icon={
              <RiHomeHeartLine
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            active={isFavouritesActive}
            rightSection={
              <TbChevronRight
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            onClick={() => handleChildNavlinksClick("favourites")}
            variant="subtle"
            data-cy="navlink-favourites"
          />
        </Link>

        <Space h="sm" />

        <Link
          to={`/home/displayBookshelf`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <NavLink
            label="Rated"
            icon={
              <GiStarsStack
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            active={isRatedActive}
            rightSection={
              <TbChevronRight
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            onClick={() => handleChildNavlinksClick("rated")}
            variant="subtle"
            data-cy="navlink-rated"
          />
        </Link>

        <Space h="sm" />

        <Link
          to={`/home/displayBookshelf`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <NavLink
            label="Finished reading"
            icon={
              <GiBlackBook
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            active={isMarkReadActive}
            rightSection={
              <TbChevronRight
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            onClick={() => handleChildNavlinksClick("markRead")}
            variant="subtle"
            data-cy="navlink-markRead"
          />
        </Link>

        <Space h="sm" />

        <Link
          to={`/home/displayBookshelf`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <NavLink
            label="Want to read"
            icon={
              <RiHealthBookFill
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            active={isReadLaterActive}
            rightSection={
              <TbChevronRight
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            onClick={() => handleChildNavlinksClick("readLater")}
            variant="subtle"
            data-cy="navlink-readLater"
          />
        </Link>
      </NavLink>

      <Space h="sm" />

      <NavLink
        label="Clear storage"
        icon={
          <RiDeleteBin6Line
            size={20}
            style={{
              color: `${theme === "light" ? "#B06519" : "#B87333"}`,
            }}
          />
        }
        data-cy="navlink-clearStorage"
        onClick={handleClearStorageNavlinkClick}
      />
    </Navbar>
  );
}

export { MyNavBar };
