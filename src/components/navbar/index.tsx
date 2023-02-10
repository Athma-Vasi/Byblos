import { Navbar, NavLink, Space } from "@mantine/core";
import { useState } from "react";
import { TbChevronsRight, TbChevronRight } from "react-icons/tb";
import { BsBookshelf } from "react-icons/bs";
import { GiBlackBook, GiBookshelf, GiStarsStack } from "react-icons/gi";
import { RiHealthBookFill, RiHomeHeartLine } from "react-icons/ri";
import {
  AllActions,
  AllDispatches,
  AllStates,
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
  const [parentNavlinkActive, setparentNavlinkActive] = useState(false);
  const [bookshelfNavlinkActive, setBookshelfNavlinkActive] = useState(false);
  const [favouritesNavlinkActive, setFavouritesNavlinkActive] = useState(false);
  const [markReadNavlinkActive, setMarkReadNavlinkActive] = useState(false);
  const [readLaterNavlinkActive, setReadLaterNavlinkActive] = useState(false);
  const [ratedNavlinkActive, setRatedNavlinkActive] = useState(false);

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
  } = allStates;
  let { responseDispatch } = allDispatches;
  let {
    responseActions: {
      setFetchUrl,
      setStartIndex,
      setSearchTerm,
      setSearchResults,
      setSelectedVolume,
      setSelectedAuthor,
      setSelectedPublisher,
      setBookshelfVolumes,
      setAll,
    },
  } = allActions;

  async function handleParentNavlinkClick() {
    setparentNavlinkActive((prev) => !prev);
  }

  async function handleChildNavlinksClick(navLinkKind: string) {
    //set opened to close the navbar
    setOpened(false);

    //navigate to top of page
    window.scrollTo(0, 0);

    //first set all other navlinks to false to remove active state
    switch (navLinkKind) {
      case "bookshelf": {
        setBookshelfNavlinkActive((prev) => !prev);
        setRatedNavlinkActive(false);
        setFavouritesNavlinkActive(false);
        setMarkReadNavlinkActive(false);
        setReadLaterNavlinkActive(false);

        break;
      }
      case "rated": {
        setRatedNavlinkActive((prev) => !prev);
        setBookshelfNavlinkActive(false);
        setFavouritesNavlinkActive(false);
        setMarkReadNavlinkActive(false);
        setReadLaterNavlinkActive(false);

        break;
      }

      case "favourites": {
        setFavouritesNavlinkActive((prev) => !prev);
        setRatedNavlinkActive(false);
        setBookshelfNavlinkActive(false);
        setMarkReadNavlinkActive(false);
        setReadLaterNavlinkActive(false);

        break;
      }

      case "markRead": {
        setMarkReadNavlinkActive((prev) => !prev);
        setRatedNavlinkActive(false);
        setBookshelfNavlinkActive(false);
        setFavouritesNavlinkActive(false);
        setReadLaterNavlinkActive(false);

        break;
      }

      case "readLater": {
        setReadLaterNavlinkActive((prev) => !prev);
        setRatedNavlinkActive(false);
        setBookshelfNavlinkActive(false);
        setFavouritesNavlinkActive(false);
        setMarkReadNavlinkActive(false);

        break;
      }

      default: {
        setBookshelfNavlinkActive((prev) => !prev);
        setRatedNavlinkActive(false);
        setFavouritesNavlinkActive(false);
        setMarkReadNavlinkActive(false);
        setReadLaterNavlinkActive(false);

        break;
      }
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
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.rating && acc.push(item.volume);

              return acc;
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
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.favourite && acc.push(item.volume);

              return acc;
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
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.markRead && acc.push(item.volume);

              return acc;
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
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.readLater && acc.push(item.volume);

              return acc;
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

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <NavLink
        label="My Library"
        active={parentNavlinkActive}
        onClick={handleParentNavlinkClick}
        icon={<BsBookshelf size={20} />}
        rightSection={<TbChevronsRight size={20} />}
        variant="subtle"
        childrenOffset={28}
        data-cy="navlink-myLibrary"
      >
        <Space h="sm" />

        <Link to={`/home/displayBookshelf`}>
          <NavLink
            label="Bookshelf"
            icon={<GiBookshelf size={20} />}
            active={bookshelfNavlinkActive}
            rightSection={<TbChevronRight size={20} />}
            onClick={() => handleChildNavlinksClick("bookshelf")}
            variant="subtle"
            data-cy="navlink-bookshelf"
          />
        </Link>

        <Space h="sm" />

        <Link to={`/home/displayBookshelf`}>
          <NavLink
            label="Favourites"
            icon={<RiHomeHeartLine size={20} />}
            active={favouritesNavlinkActive}
            rightSection={<TbChevronRight size={20} />}
            onClick={() => handleChildNavlinksClick("favourites")}
            variant="subtle"
            data-cy="navlink-favourites"
          />
        </Link>

        <Space h="sm" />

        <Link to={`/home/displayBookshelf`}>
          <NavLink
            label="Rated"
            icon={<GiStarsStack size={20} />}
            active={ratedNavlinkActive}
            rightSection={<TbChevronRight size={20} />}
            onClick={() => handleChildNavlinksClick("rated")}
            variant="subtle"
            data-cy="navlink-rated"
          />
        </Link>

        <Space h="sm" />

        <Link to={`/home/displayBookshelf`}>
          <NavLink
            label="Finished reading"
            icon={<GiBlackBook size={20} />}
            active={markReadNavlinkActive}
            rightSection={<TbChevronRight size={20} />}
            onClick={() => handleChildNavlinksClick("markRead")}
            variant="subtle"
            data-cy="navlink-markRead"
          />
        </Link>

        <Space h="sm" />

        <Link to={`/home/displayBookshelf`}>
          <NavLink
            label="Want to read"
            icon={<RiHealthBookFill size={20} />}
            active={readLaterNavlinkActive}
            rightSection={<TbChevronRight size={20} />}
            onClick={() => handleChildNavlinksClick("readLater")}
            variant="subtle"
            data-cy="navlink-readLater"
          />
        </Link>
      </NavLink>
    </Navbar>
  );
}

export { MyNavBar };
