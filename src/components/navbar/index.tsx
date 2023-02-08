import { Navbar, NavLink, Space, Text } from "@mantine/core";
import { useState } from "react";
import { TbChevronsRight, TbChevronRight } from "react-icons/tb";
import { BsBookshelf } from "react-icons/bs";
import { GiBlackBook, GiBookshelf, GiStarsStack } from "react-icons/gi";
import { RiHealthBookFill, RiHomeHeartLine } from "react-icons/ri";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseUserBookshelf,
  ApiResponseVolume,
  UserBookshelf,
  VolumeWithCustomId,
} from "../../types";
import localforage from "localforage";
import { Link, useNavigate } from "react-router-dom";

type MyNavBarProps = {
  children?: React.ReactNode;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyNavBar({
  children,
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

  const navigate = useNavigate();

  async function handleParentNavlinkClick() {
    //set parent navlink to active
    setparentNavlinkActive((prev) => !prev);

    // //grabs userBookshelf from localforage and disables child links if there are no corresponding entries

    // const userBookshelf = await localforage.getItem<UserBookshelf[]>(
    //   "byblos-userBookshelf"
    // );

    // if (userBookshelf) {
    //   const userBookshelf_ = userBookshelf as UserBookshelf[];

    //   const userBookshelfFavourites = userBookshelf_.filter(
    //     (userBookshelf) => userBookshelf.favourite === true
    //   );
    //   console.log("userBookshelfFavourites", userBookshelfFavourites);

    //   const userBookshelfMarkRead = userBookshelf_.filter(
    //     (userBookshelf) => userBookshelf.markRead === true
    //   );
    //   console.log("userBookshelfMarkRead", userBookshelfMarkRead);

    //   const userBookshelfReadLater = userBookshelf_.filter(
    //     (userBookshelf) => userBookshelf.readLater === true
    //   );
    //   console.log("userBookshelfReadLater", userBookshelfReadLater);

    //   const userBookshelfRated = userBookshelf_.filter(
    //     (userBookshelf) => userBookshelf.rating !== 0
    //   );
    //   console.log("userBookshelfRated", userBookshelfRated);

    //   //because there is a sample volume always present
    //   if (userBookshelfFavourites.length === 1) {
    //     const favouritesNavlink = document.querySelector<HTMLElement>(
    //       "[data-cy='navlink-favourites']"
    //     );
    //     favouritesNavlink?.setAttribute("disabled", "true");
    //   }

    //   if (userBookshelfMarkRead.length === 1) {
    //     const markReadNavlink = document.querySelector<HTMLElement>(
    //       "[data-cy='navlink-markRead']"
    //     );
    //     markReadNavlink?.setAttribute("disabled", "true");
    //   }

    //   if (userBookshelfReadLater.length === 1) {
    //     setReadLaterNavlinkActive(false);
    //   }

    //   if (userBookshelfRated.length === 1) {
    //     setRatedNavlinkActive(false);
    //   }
    // }
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

    //remember the state of responseState before we change it so if the user goes back from the bookshelf page, we can restore the state

    //grab the userBookshelf from localforage
    try {
      const userBookshelf = await localforage.getItem<UserBookshelf[]>(
        "byblos-userBookshelf"
      );

      const userBookshelfClone = structuredClone(userBookshelf);

      console.log("userBookshelfClone", userBookshelfClone);

      switch (navLinkKind) {
        case "bookshelf": {
          //grab just the volumes from the userBookshelf
          const volumes = userBookshelfClone?.map((item) => item.volume);

          //searchResults accepts an object in the shape of the google books api results typed as ApiResponseVolume, except it has a custom id inserted into each volume (for rendering purposes only)
          const userBookshelfApiResponse: ApiResponseUserBookshelf = {
            kind: "books#bookshelf",
            totalItems: volumes?.length ?? 0,
            items: volumes ?? [],
          };

          if (userBookshelf) {
            allStates.responseState.searchResults = userBookshelfApiResponse;

            allStates.responseState.resultsPerPage = "40";

            //rest are set to initial state
            allStates.responseState.searchTerm = "";
            allStates.responseState.fetchUrl = "";
            allStates.responseState.selectedVolume = null;
            allStates.responseState.selectedAuthor = "";
            allStates.responseState.selectedPublisher = "";

            allDispatches.responseDispatch({
              type: allActions.responseActions.setAll,
              payload: { responseState: allStates.responseState },
            });

            console.log("bookshelf", userBookshelfApiResponse);

            // navigate("/home/displayBookshelf");
          }

          break;
        }

        case "rated": {
          //grab just the volumes from the userBookshelf
          const ratedVolumes = userBookshelfClone?.reduce(
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.rating && acc.push(item.volume);

              return acc;
            },
            []
          );

          //searchResults accepts an object in the shape of the google books api results typed as ApiResponseVolume
          const ratedVolumesApiResponse: ApiResponseUserBookshelf = {
            kind: "books#volumes",
            totalItems: ratedVolumes?.length ?? 0,
            items: ratedVolumes ?? [],
          };

          if (userBookshelf) {
            allStates.responseState.searchResults = ratedVolumesApiResponse;

            allStates.responseState.resultsPerPage = "40";

            //rest are set to initial state
            allStates.responseState.searchTerm = "";
            allStates.responseState.fetchUrl = "";
            allStates.responseState.selectedVolume = null;
            allStates.responseState.selectedAuthor = "";
            allStates.responseState.selectedPublisher = "";

            allDispatches.responseDispatch({
              type: allActions.responseActions.setAll,
              payload: { responseState: allStates.responseState },
            });

            // navigate("/home/displayBookshelf");
          }

          break;
        }

        case "favourites": {
          //grab just the volumes from the userBookshelf
          const favouriteVolumes = userBookshelfClone?.reduce(
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.favourite && acc.push(item.volume);

              return acc;
            },
            []
          );

          //searchResults accepts an object in the shape of the google books api results typed as ApiResponseVolume
          const favouriteVolumesApiResponse: ApiResponseUserBookshelf = {
            kind: "books#volumes",
            totalItems: favouriteVolumes?.length ?? 0,
            items: favouriteVolumes ?? [],
          };

          if (userBookshelf) {
            allStates.responseState.searchResults = favouriteVolumesApiResponse;

            allStates.responseState.resultsPerPage = "40";

            //rest are set to initial state
            allStates.responseState.searchTerm = "";
            allStates.responseState.fetchUrl = "";
            allStates.responseState.selectedVolume = null;
            allStates.responseState.selectedAuthor = "";
            allStates.responseState.selectedPublisher = "";

            allDispatches.responseDispatch({
              type: allActions.responseActions.setAll,
              payload: { responseState: allStates.responseState },
            });

            // navigate("/home/displayBookshelf");
          }

          break;
        }

        case "markRead": {
          //grab just the volumes from the userBookshelf
          const markReadVolumes = userBookshelfClone?.reduce(
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.markRead && acc.push(item.volume);

              return acc;
            },
            []
          );

          //searchResults accepts an object in the shape of the google books api results typed as ApiResponseVolume
          const markReadVolumesApiResponse: ApiResponseUserBookshelf = {
            kind: "books#volumes",
            totalItems: markReadVolumes?.length ?? 0,
            items: markReadVolumes ?? [],
          };

          if (userBookshelf) {
            allStates.responseState.searchResults = markReadVolumesApiResponse;

            allStates.responseState.resultsPerPage = "40";

            //rest are set to initial state
            allStates.responseState.searchTerm = "";
            allStates.responseState.fetchUrl = "";
            allStates.responseState.selectedVolume = null;
            allStates.responseState.selectedAuthor = "";
            allStates.responseState.selectedPublisher = "";

            allDispatches.responseDispatch({
              type: allActions.responseActions.setAll,
              payload: { responseState: allStates.responseState },
            });

            // navigate("/home/displayBookshelf");
          }

          break;
        }

        case "readLater": {
          //grab just the volumes from the userBookshelf
          const readLaterVolumes = userBookshelfClone?.reduce(
            (acc: VolumeWithCustomId[], item: UserBookshelf) => {
              item.readLater && acc.push(item.volume);

              return acc;
            },
            []
          );

          //searchResults accepts an object in the shape of the google books api results typed as ApiResponseVolume
          const readLaterVolumesApiResponse: ApiResponseUserBookshelf = {
            kind: "books#volumes",
            totalItems: readLaterVolumes?.length ?? 0,
            items: readLaterVolumes ?? [],
          };

          if (userBookshelf) {
            allStates.responseState.searchResults = readLaterVolumesApiResponse;

            allStates.responseState.resultsPerPage = "40";

            //rest are set to initial state
            allStates.responseState.searchTerm = "";
            allStates.responseState.fetchUrl = "";
            allStates.responseState.selectedVolume = null;
            allStates.responseState.selectedAuthor = "";
            allStates.responseState.selectedPublisher = "";

            allDispatches.responseDispatch({
              type: allActions.responseActions.setAll,
              payload: { responseState: allStates.responseState },
            });

            // navigate("/home/displayBookshelf");
          }

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
        // description="My selected volumes"
        onClick={handleParentNavlinkClick}
        icon={<BsBookshelf size={20} />}
        rightSection={<TbChevronsRight size={20} />}
        variant="subtle"
        childrenOffset={28}
        data-cy="navlink-myLibrary"
      >
        <Space h="sm" />

        <Link to={`/home/displayResults/1`}>
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

        <Link to={`/home/displayResults/1`}>
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

        <Link to={`/home/displayResults/1`}>
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

        <Link to={`/home/displayResults/1`}>
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

        <Link to={`/home/displayResults/1`}>
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
