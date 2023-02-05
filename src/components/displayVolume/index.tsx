import { Flex, Menu, NavLink } from "@mantine/core";
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
import { historyActions } from "../../state/historyState";
import { responseActions } from "../../state/responseState";
import {
  AllActions,
  AllDispatches,
  AllStates,
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
  const { responseState, historyState } = allStates;
  const { responseDispatch, historyDispatch } = allDispatches;
  const { responseActions, historyActions } = allActions;

  const navigate = useNavigate();
  const { volumeId, page } = useParams();
  const { width = 0 } = useWindowSize();

  const {
    responseState: { selectedVolume, selectedAuthor },
  } = allStates;
  const [navLinkActive, setNavLinkActive] = useState({
    menu: false,
    overview: true,
    otherEditions: false,
    publisherCollection: false,
    authorCollection: false,
  });
  const [menuOpened, setMenuOpened] = useState(false);

  function handleNavLinkActiveClick(label: string) {
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

      try {
        await localforage
          .getItem<ResponseState["activePage"]>("byblos-activePage")
          .then((value) => {
            if (value) {
              if (value === 1) {
                // set response state to prev history state
                const prevHistoryState = historyState.pop();
                if (prevHistoryState) {
                  responseState.activePage = prevHistoryState.activePage;
                  responseState.searchResults = prevHistoryState.searchResults;
                  responseState.fetchUrl = prevHistoryState.fetchUrl;
                  responseState.selectedVolume =
                    prevHistoryState.selectedVolume;
                  responseState.selectedAuthor =
                    prevHistoryState.selectedAuthor;
                  responseState.selectedPublisher =
                    prevHistoryState.selectedPublisher;

                  responseDispatch({
                    type: responseActions.setAll,
                    payload: { responseState },
                  });

                  //remove the current state from history by popping the current responseState from the historyState stack
                  historyDispatch({
                    type: historyActions.popHistory,
                    payload: {
                      historyState: {
                        searchTerm: responseState.searchTerm,
                        activePage: responseState.activePage,
                        fetchUrl: responseState.fetchUrl,
                        selectedVolume: responseState.selectedVolume,
                        selectedAuthor: responseState.selectedAuthor,
                        selectedPublisher: responseState.selectedPublisher,
                        resultsPerPage: responseState.resultsPerPage,
                        searchResults: responseState.searchResults,
                      },
                    },
                  });

                  navigate(
                    `/home/displayResults/${prevHistoryState.activePage}`
                  );

                  return;
                }
              }
              //activePage is not 1 and continue going back
              responseState.activePage = value - 1;
            }
          });
      } catch (error) {
        console.error("Error in pagination browser back button click:", error);
      }
    };

    window.addEventListener("popstate", onBackButtonEvent);
    // window.addEventListener("popstate", onForwardButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
      // window.removeEventListener("popstate", onForwardButtonEvent);
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
              <Link
                to={`/home/displayVolume/${volumeId}/otherEditions/${allStates.responseState.activePage}`}
              >
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
                to={`/home/displayVolume/${volumeId}/publisherCollection/${allStates.responseState.activePage}`}
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
              <Link
                to={`/home/displayVolume/${volumeId}/authorCollection/${allStates.responseState.activePage}`}
              >
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

      <Outlet />
    </Flex>
  );
}

export default DisplayVolume;
