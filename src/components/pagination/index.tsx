import { Button, Center, Grid, NumberInput, Space, Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
} from "../../types";

type MyPaginationProps = {
  children?: React.ReactNode;
  parentPath: string;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyPagination({
  parentPath,
  allStates: { responseState, historyState },
  allActions: { responseActions, historyActions },
  allDispatches: { responseDispatch, historyDispatch },
}: MyPaginationProps) {
  const { page, volumeId } = useParams();

  const navigate = useNavigate();
  const { width = 0 } = useWindowSize();
  const { searchTerm, searchResults, fetchUrl, activePage, resultsPerPage } =
    responseState;

  const totalItems = searchResults?.totalItems ?? 1;

  const numberOfPages = Math.ceil(totalItems / Number(resultsPerPage));

  const startIndex =
    activePage * Number(resultsPerPage) - Number(resultsPerPage);

  //handles browser back and forward button page navigation
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
                }
              } else if (value === 0) {
                navigate(`/home/displayResults/1`);
              }
              //activePage is not 1 and continue going back
              responseState.activePage = value - 1;
            }
          });

        await localforage
          .setItem("byblos-activePage", responseState.activePage)
          .then((value) => {
            responseDispatch({
              type: responseActions.setActivePage,
              payload: { responseState },
            });
            window.scrollTo(0, 0);
            navigate(`${parentPath}${value}`);
          });
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "onBackButtonEvent()",
        });

        console.group("Error in pagination useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  //this is only to be used when the page changes
  useEffect(() => {
    if (searchTerm && fetchUrl) {
      const fetchUsingStartIndex = async () => {
        const [first, ...rest] = fetchUrl.split("&");
        const startIndexAddedToFetchUrl = `${first}&startIndex=${startIndex}&${rest.join(
          "&"
        )}`;

        console.log("startIndexAddedToFetchUrl: ", startIndexAddedToFetchUrl);

        try {
          const { data } = await axios.get(startIndexAddedToFetchUrl);
          responseState.activePage = activePage;
          responseState.searchResults = data;

          //save the data to localForage
          await localforage.setItem<ResponseState["activePage"]>(
            "byblos-activePage",
            responseState.activePage
          );
          await localforage.setItem<ResponseState["searchResults"]>(
            "byblos-searchResults",
            responseState.searchResults
          );
        } catch (error: any) {
          const error_ = new Error(error, { cause: "fetchUsingStartIndex()" });

          console.group("Error in pagination useEffect");
          console.error("name: ", error_.name);
          console.error("message: ", error_.message);
          console.error("cause: ", error_.cause);
          console.groupCollapsed("stack trace");
          console.trace(error_);
          console.error("detailed stack trace", error_.stack);
          console.groupEnd();
        } finally {
          responseDispatch({
            type: responseActions.setAll,
            payload: { responseState },
          });
        }
      };

      fetchUsingStartIndex();

      //scroll to top of page
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseState.activePage]);

  async function handlePrevPageBttnClick() {
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

    try {
      await localforage
        .getItem<ResponseState["activePage"]>("byblos-activePage")
        .then((value) => {
          if (value) {
            if (value === 1) return;
            responseState.activePage = value - 1;
          }
        });

      await localforage
        .setItem("byblos-activePage", responseState.activePage)
        .then((value) => {
          responseDispatch({
            type: responseActions.setActivePage,
            payload: { responseState },
          });
          window.scrollTo(0, 0);
          navigate(`${parentPath}${value}`);
        });
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handlePrevPageBttnClick()",
      });

      console.group("Error in pagination useEffect");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  async function handleNextPageBttnClick() {
    //save the current state to history by pushing current responseState into the historyState stack
    historyDispatch({
      type: historyActions.pushHistory,
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

    try {
      await localforage
        .getItem<ResponseState["activePage"]>("byblos-activePage")
        .then((value) => {
          if (value) {
            if (value === numberOfPages) return;
            responseState.activePage = value + 1;
          }
        });

      await localforage
        .setItem("byblos-activePage", responseState.activePage)
        .then((value) => {
          responseDispatch({
            type: responseActions.setActivePage,
            payload: { responseState },
          });
          window.scrollTo(0, 0);
          navigate(`${parentPath}${value}`);
        });
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleNextPageBttnClick()",
      });

      console.group("Error in pagination useEffect");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  async function handlePageJumpBttnClick(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const pageToJumpTo = Number(formData.get("bttn-pageJump"));

    if (pageToJumpTo < 1 || pageToJumpTo > numberOfPages) return;

    responseState.activePage = pageToJumpTo;

    try {
      await localforage
        .setItem("byblos-activePage", responseState.activePage)
        .then((value) => {
          window.scrollTo(0, 0);
          navigate(`${parentPath}${value}`);
        });
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handlePageJumpBttnClick()",
      });

      console.group("Error in pagination useEffect");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    } finally {
      responseDispatch({
        type: responseActions.setActivePage,
        payload: { responseState },
      });
    }
  }

  return (
    <Fragment>
      <Grid columns={3}>
        <Grid.Col span={1}>
          <Center>
            <Link to={`/home/displayResults/${responseState.activePage}`}>
              <Button
                disabled={activePage === 1}
                onClick={handlePrevPageBttnClick}
              >
                Prev
              </Button>
            </Link>
          </Center>
        </Grid.Col>
        <Grid.Col span={1}>
          <Center style={{ width: "100%", height: "100%" }}>
            <Text>
              Page: {activePage === 0 ? 1 : activePage} of {numberOfPages}
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={1}>
          <Center>
            <Link to={`/home/displayResults/${responseState.activePage}`}>
              <Button
                disabled={activePage === numberOfPages}
                onClick={handleNextPageBttnClick}
              >
                Next
              </Button>
            </Link>
          </Center>
        </Grid.Col>
      </Grid>

      {Array.from({ length: 3 }).map((_, index) => (
        <Space key={index} h="md" />
      ))}

      <form action="#" onSubmit={handlePageJumpBttnClick}>
        <Grid columns={3}>
          <Grid.Col span={1}></Grid.Col>

          <Grid.Col span={1}>
            <Center style={{ width: "100%", height: "100%" }}>
              <NumberInput
                defaultValue={activePage}
                min={1}
                max={numberOfPages}
                value={activePage}
                name="bttn-pageJump"
                size={width < 576 ? "xs" : "sm"}
                px={width < 576 ? "sm" : "md"}
              />

              <Link to={`/home/displayResults/${responseState.activePage}`}>
                <Button type="submit">Jump to</Button>
              </Link>
            </Center>
          </Grid.Col>

          <Grid.Col span={1}></Grid.Col>
        </Grid>
      </form>
    </Fragment>
  );
}

export { MyPagination };
