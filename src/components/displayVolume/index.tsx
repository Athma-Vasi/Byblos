import { Button, Flex, Menu, NavLink, Space, Text } from "@mantine/core";
import localforage from "localforage";
import React, { useState } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { BsMenuButtonFill } from "react-icons/bs";
import { GrOverview } from "react-icons/gr";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdOutlinePublish } from "react-icons/md";
import { VscUngroupByRefType } from "react-icons/vsc";
import { Outlet, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  NavlinksStateActionDispatch,
} from "../../types";
import { toggleCurrentlyActiveNavlink } from "../../utils";

type DisplayVolumeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayVolume({
  allStates,
  allActions,
  allDispatches,
}: DisplayVolumeProps) {
  const { volumeId, page } = useParams();
  const { width = 0 } = useWindowSize();

  const [navLinkActive, setNavLinkActive] = useState({
    menu: false,
    overview: true,
    otherEditions: false,
    publisherCollection: false,
    authorCollection: false,
  });
  const [menuOpened, setMenuOpened] = useState(false);

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
    navlinksState,
  } = allStates;
  let { navlinksActions } = allActions;
  let { navlinksDispatch } = allDispatches;

  const navlinksStateActionDispatch: NavlinksStateActionDispatch = {
    navlinksState,
    navlinksActions,
    navlinksDispatch,
  };

  async function handleNavLinkActiveClick(
    label: string,
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

    //set history state
    //used to retrieve history state when user clicks browser back button as
    //stateful data is lost when component unmounts
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
        cause: "handleNavLinkActiveClick()",
      });

      console.group("Error in displayVolume eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }

    switch (label) {
      case "Menu": {
        setNavLinkActive({
          ...navLinkActive,
          menu: true,
        });
        break;
      }

      case "Overview": {
        setNavLinkActive({
          ...navLinkActive,
          overview: true,
          otherEditions: false,
          publisherCollection: false,
          authorCollection: false,
        });
        break;
      }
      case "Other editions": {
        setNavLinkActive({
          ...navLinkActive,
          overview: false,
          otherEditions: true,
          publisherCollection: false,
          authorCollection: false,
        });
        break;
      }
      case "Publisher collection": {
        setNavLinkActive({
          ...navLinkActive,
          overview: false,
          otherEditions: false,
          publisherCollection: true,
          authorCollection: false,
        });
        break;
      }
      case "Author collection": {
        setNavLinkActive({
          ...navLinkActive,
          overview: false,
          otherEditions: false,
          publisherCollection: false,
          authorCollection: true,
        });
        break;
      }
      default: {
        setNavLinkActive({
          ...navLinkActive,
          overview: true,
          otherEditions: false,
          publisherCollection: false,
          authorCollection: false,
        });
        break;
      }
    }
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ width: "100%" }}
    >
      {/* Nav links */}
      <Menu
        position="bottom-start"
        transition={width < 576 ? "slide-left" : "slide-down"}
        transitionDuration={382}
        radius="sm"
      >
        <Menu.Target>
          <NavLink
            active={navLinkActive.menu}
            label="Menu"
            variant="light"
            icon={
              <BsMenuButtonFill
                size={20}
                style={{
                  color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                }}
              />
            }
            data-cy="menu-displayVolume"
            onClick={() => {
              handleNavLinkActiveClick("Menu", navlinksStateActionDispatch);
              setMenuOpened(!menuOpened);
            }}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label color={theme === "light" ? "dark.6" : "gray.5"}>
            Navigate to
          </Menu.Label>

          <Flex direction={width < 576 ? "column" : "row"}>
            <Menu.Item>
              <Link
                to={`/home/displayVolume/${volumeId}/overview`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <NavLink
                  active={navLinkActive.overview}
                  label="Overview"
                  variant="subtle"
                  icon={
                    <HiOutlineViewGrid
                      size={20}
                      style={{
                        color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                      }}
                    />
                  }
                  data-cy="menu-overview-displayVolume"
                  onClick={() =>
                    handleNavLinkActiveClick(
                      "Overview",
                      navlinksStateActionDispatch
                    )
                  }
                />
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                to={`/home/displayVolume/${volumeId}/otherEditions/1`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <NavLink
                  active={navLinkActive.otherEditions}
                  label="Other editions"
                  variant="subtle"
                  icon={
                    <VscUngroupByRefType
                      size={20}
                      style={{
                        color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                      }}
                    />
                  }
                  data-cy="menu-otherEditions-displayVolume"
                  onClick={() =>
                    handleNavLinkActiveClick(
                      "Other editions",
                      navlinksStateActionDispatch
                    )
                  }
                />
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                to={`/home/displayVolume/${volumeId}/publisherCollection/1`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <NavLink
                  active={navLinkActive.publisherCollection}
                  label="Publisher collection"
                  variant="subtle"
                  icon={
                    <MdOutlinePublish
                      size={20}
                      style={{
                        color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                      }}
                    />
                  }
                  data-cy="menu-publisherCollection-displayVolume"
                  onClick={() =>
                    handleNavLinkActiveClick(
                      "Publisher collection",
                      navlinksStateActionDispatch
                    )
                  }
                />
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                to={`/home/displayVolume/${volumeId}/authorCollection/1`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <NavLink
                  active={navLinkActive.authorCollection}
                  label="Author collection"
                  variant="subtle"
                  icon={
                    <BsPersonLinesFill
                      size={20}
                      style={{
                        color: `${theme === "light" ? "#B06519" : "#B87333"}`,
                      }}
                    />
                  }
                  data-cy="menu-authorCollection-displayVolume"
                  onClick={() =>
                    handleNavLinkActiveClick(
                      "Author collection",
                      navlinksStateActionDispatch
                    )
                  }
                />
              </Link>
            </Menu.Item>
          </Flex>
        </Menu.Dropdown>
      </Menu>

      <Space h="xl" />

      <Outlet />
    </Flex>
  );
}

export default DisplayVolume;
