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

  async function handleBookshelfNavlinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    //first set all other navlinks to false to remove active state
    setBookshelfNavlinkActive((prev) => !prev);
    setRatedNavlinkActive(false);
    setFavouritesNavlinkActive(false);
    setMarkReadNavlinkActive(false);
    setReadLaterNavlinkActive(false);

    //set opened to close the navbar
    setOpened(false);

    //grab the userBookshelf from localforage and set it to state
    try {
      const userBookshelf = await localforage.getItem<UserBookshelf[]>(
        "byblos-userBookshelf"
      );

      const userBookshelfClone = structuredClone(userBookshelf);

      console.log("userBookshelfClone", userBookshelfClone);

      //grab just the volumes from the userBookshelf
      const volumes = userBookshelfClone?.map((item) => item.volume);
    } catch (error) {
      console.error("Error in handleBookshelfNavlinkClick(): ", error);
    }

    //   //grab just the volumes from the userBookshelf
    //   const volumes = userBookshelfClone?.map((item) => item.volume);

    //   //searchResults accepts an object in the shape of the google books api results typed as ApiResponseVolume
    //   const userBookshelfApiResponse: ApiResponseVolume = {
    //     kind: "books#bookshelf",
    //     totalItems: volumes?.length ?? 0,
    //     items: volumes ?? [],
    //   };

    //   if (userBookshelf) {
    //     allStates.responseState.searchResults = userBookshelfApiResponse;
    //     allStates.responseState.activePage = 1;
    //     allStates.responseState.resultsPerPage = "40";

    //     //rest are set to initial state
    //     allStates.responseState.searchTerm = "";
    //     allStates.responseState.fetchUrl = "";
    //     allStates.responseState.selectedVolume = null;
    //     allStates.responseState.selectedAuthor = "";
    //     allStates.responseState.selectedPublisher = "";

    //     allDispatches.responseDispatch({
    //       type: allActions.responseActions.setAll,
    //       payload: { responseState: allStates.responseState },
    //     });

    //     navigate("/home/displayBookshelf");
    //   }
    // } catch (error) {
    //   console.error("Error in handleBookshelfNavlinkClick(): ", error);
    // }
  }

  async function handleFavouritesNavlinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setFavouritesNavlinkActive((prev) => !prev);
    setRatedNavlinkActive(false);
    setBookshelfNavlinkActive(false);
    setMarkReadNavlinkActive(false);
    setReadLaterNavlinkActive(false);

    //set opened to close the navbar
    setOpened(false);
  }

  async function handleMarkReadNavlinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setMarkReadNavlinkActive((prev) => !prev);
    setRatedNavlinkActive(false);
    setBookshelfNavlinkActive(false);
    setFavouritesNavlinkActive(false);
    setReadLaterNavlinkActive(false);

    //set opened to close the navbar
    setOpened(false);
  }

  async function handleReadLaterNavlinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setReadLaterNavlinkActive((prev) => !prev);
    setRatedNavlinkActive(false);
    setBookshelfNavlinkActive(false);
    setFavouritesNavlinkActive(false);
    setMarkReadNavlinkActive(false);

    //set opened to close the navbar
    setOpened(false);
  }

  async function handleRatedNavlinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setRatedNavlinkActive((prev) => !prev);
    setBookshelfNavlinkActive(false);
    setFavouritesNavlinkActive(false);
    setMarkReadNavlinkActive(false);
    setReadLaterNavlinkActive(false);

    //set opened to close the navbar
    setOpened(false);
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
        onClick={() => setparentNavlinkActive(!parentNavlinkActive)}
        icon={<BsBookshelf size={20} />}
        rightSection={<TbChevronsRight size={20} />}
        variant="subtle"
        childrenOffset={28}
      >
        <Space h="sm" />

        <NavLink
          label="Bookshelf"
          icon={<GiBookshelf size={20} />}
          active={bookshelfNavlinkActive}
          rightSection={<TbChevronRight size={20} />}
          onClick={handleBookshelfNavlinkClick}
          variant="subtle"
        />

        <Space h="sm" />

        <NavLink
          label="Favourites"
          icon={<RiHomeHeartLine size={20} />}
          active={favouritesNavlinkActive}
          rightSection={<TbChevronRight size={20} />}
          onClick={handleFavouritesNavlinkClick}
          variant="subtle"
        />

        <Space h="sm" />

        <NavLink
          label="Rated"
          icon={<GiStarsStack size={20} />}
          active={ratedNavlinkActive}
          rightSection={<TbChevronRight size={20} />}
          onClick={handleRatedNavlinkClick}
          variant="subtle"
        />

        <Space h="sm" />

        <NavLink
          label="Finished reading"
          icon={<GiBlackBook size={20} />}
          active={markReadNavlinkActive}
          rightSection={<TbChevronRight size={20} />}
          onClick={handleMarkReadNavlinkClick}
          variant="subtle"
        />

        <Space h="sm" />

        <NavLink
          label="Want to read"
          icon={<RiHealthBookFill size={20} />}
          active={readLaterNavlinkActive}
          rightSection={<TbChevronRight size={20} />}
          onClick={handleReadLaterNavlinkClick}
          variant="subtle"
        />
      </NavLink>
    </Navbar>
  );
}

export { MyNavBar };
