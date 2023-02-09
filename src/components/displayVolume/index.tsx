import { Flex, Menu, NavLink, Space } from "@mantine/core";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { BsMenuButtonFill } from "react-icons/bs";
import { GrOverview } from "react-icons/gr";
import { MdOutlinePublish } from "react-icons/md";
import { VscUngroupByRefType } from "react-icons/vsc";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { responseActions } from "../../state/responseState";
import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  ResponseState,
} from "../../types";

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
  let {
    responseState: {
      fetchUrl,
      startIndex,
      searchTerm,
      searchResults,
      selectedVolume,
      selectedAuthor,
      selectedPublisher,
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
    },
  } = allActions;

  const navigate = useNavigate();
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

  async function handleNavLinkActiveClick(label: string) {
    //set history state
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
      });

      await localforage.setItem<HistoryState>(
        "byblos-historyState",
        historyStateLocalForage
      );
    } catch (error) {
      console.log("error: ", error);
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

  //handles browser back button click and is included here separately from the function inside pagination component's useEffect because the pagination component is not rendered here
  useEffect(() => {
    const onBackButtonEvent = async (event: PopStateEvent) => {
      event.preventDefault();
    };

    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  return (
    <Flex direction="column" align="center" justify="center">
      {/* Nav links */}

      <Menu
        position="bottom-start"
        transition={width < 576 ? "slide-left" : "slide-down"}
        transitionDuration={382}
      >
        <Menu.Target>
          <NavLink
            active={navLinkActive.menu}
            label="Menu"
            variant="light"
            icon={<BsMenuButtonFill size={20} />}
            onClick={() => {
              handleNavLinkActiveClick("Menu");
              setMenuOpened(!menuOpened);
            }}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Navigate to</Menu.Label>
          <Flex direction={width < 576 ? "column" : "row"}>
            <Menu.Item>
              <Link to={`/home/displayVolume/${volumeId}/overview`}>
                <NavLink
                  active={navLinkActive.overview}
                  label="Overview"
                  variant="subtle"
                  icon={<GrOverview size={20} />}
                  onClick={() => handleNavLinkActiveClick("Overview")}
                />
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link to={`/home/displayVolume/${volumeId}/otherEditions/1`}>
                <NavLink
                  active={navLinkActive.otherEditions}
                  label="Other editions"
                  variant="subtle"
                  icon={<VscUngroupByRefType size={20} />}
                  onClick={() => handleNavLinkActiveClick("Other editions")}
                />
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                to={`/home/displayVolume/${volumeId}/publisherCollection/1`}
              >
                <NavLink
                  active={navLinkActive.publisherCollection}
                  label="Publisher collection"
                  variant="subtle"
                  icon={<MdOutlinePublish size={20} />}
                  onClick={() =>
                    handleNavLinkActiveClick("Publisher collection")
                  }
                />
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link to={`/home/displayVolume/${volumeId}/authorCollection/1`}>
                <NavLink
                  active={navLinkActive.authorCollection}
                  label="Author collection"
                  variant="subtle"
                  icon={<BsPersonLinesFill size={20} />}
                  onClick={() => handleNavLinkActiveClick("Author collection")}
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
