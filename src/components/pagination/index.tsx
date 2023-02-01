import { Button, Center, Grid, NumberInput, Space, Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates, ResponseState } from "../../types";

type MyPaginationProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyPagination({
  allStates: { responseState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: MyPaginationProps) {
  const { width = 0 } = useWindowSize();
  const { searchTerm, searchResults, fetchUrl, activePage, resultsPerPage } =
    responseState;

  const totalItems = searchResults?.totalItems ?? 0;
  console.log("totalItems: ", totalItems);

  const numberOfPages = Math.ceil(totalItems / Number(resultsPerPage));
  console.log("numberOfPages: ", numberOfPages);

  const startIndex = activePage * Number(resultsPerPage) - Number(resultsPerPage);
  console.log("startIndex: ", startIndex);

  //
  //
  // const [numberOfPages, setNumberOfPages] = useState(0);
  // const [startIndex, setStartIndex] = useState(0);

  // useEffect(() => {
  //   const fetchItemsData = async () => {
  //     try {
  //       localforage
  //         .getItem<ResponseState["searchResults"]>("byblos-searchResults")
  //         .then((value) => {
  //           console.log("value from pagination: ", value);
  //           if (value) {
  //             setNumberOfPages(Math.ceil(value.totalItems / Number(resultsPerPage)));
  //             setStartIndex(activePage * Number(resultsPerPage) - Number(resultsPerPage));
  //           }
  //         });
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       responseDispatch({
  //         type: responseActions.setAll,
  //         payload: { responseState },
  //       });
  //     }
  //   };

  //   fetchItemsData();
  // }, []);

  //this is only to be used when the page changes
  useEffect(() => {
    if (searchTerm && fetchUrl) {
      console.log("activePage: ", activePage);

      const fetchUsingStartIndex = async () => {
        const [first, ...rest] = fetchUrl.split("&");
        const startIndexAddedToFetchUrl = `${first}&startIndex=${startIndex}&${rest.join(
          "&",
        )}`;

        console.log("startIndexAddedToFetchUrl: ", startIndexAddedToFetchUrl);
        try {
          const { data } = await axios.get(startIndexAddedToFetchUrl);
          responseState.activePage = activePage;
          responseState.searchResults = data;

          //save the data to localForage
          localforage.setItem<ResponseState["activePage"]>(
            "byblos-activePage",
            responseState.activePage,
          );
          localforage.setItem<ResponseState["searchResults"]>(
            "byblos-searchResults",
            responseState.searchResults,
          );
          console.log("pagination useEffect: ", data);
        } catch (error) {
          console.error(error);
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
  }, [activePage]);

  async function handlePrevPageBttnClick() {
    try {
      // localforage.getItem<ResponseState>("responseState").then((value) => {
      //   if (value) {
      //     if (value.activePage === 1) return;
      //     console.log("pagination prevButton: ", value);
      //     responseState.activePage = value.activePage - 1;
      //     responseDispatch({
      //       type: responseActions.setActivePage,
      //       payload: { responseState },
      //     });
      //   }
      // });

      // localforage.setItem("responseState", responseState).then((_) => {
      //   scrollTo(0, 0);
      // });

      localforage
        .getItem<ResponseState["activePage"]>("byblos-activePage")
        .then((value) => {
          if (value) {
            if (value === 1) return;
            console.log("pagination prevButton: ", value);
            responseState.activePage = value - 1;
          }
        });

      localforage.setItem("byblos-activePage", responseState.activePage).then((_) => {
        responseDispatch({
          type: responseActions.setActivePage,
          payload: { responseState },
        });
        window.scrollTo(0, 0);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleNextPageBttnClick() {
    // event: MouseEvent<HTMLButtonElement, MouseEvent>,
    // if (activePage === numberOfPages) return;
    // responseState.activePage = activePage + 1;
    // responseDispatch({
    //   type: responseActions.setActivePage,
    //   payload: { responseState },
    // });

    // //scroll to top of page
    // window.scrollTo(0, 0);

    try {
      // localforage.getItem<ResponseState>("responseState").then((value) => {
      //   if (value) {
      //     if (value.activePage === numberOfPages) return;
      //     console.log("pagination nextButton: ", value);
      //     responseState.activePage = value.activePage + 1;
      //   }
      // });

      // localforage.setItem("responseState", responseState).then((_) => {
      //   responseDispatch({
      //     type: responseActions.setActivePage,
      //     payload: { responseState },
      //   });
      //   scrollTo(0, 0);
      // });

      localforage
        .getItem<ResponseState["activePage"]>("byblos-activePage")
        .then((value) => {
          if (value) {
            if (value === numberOfPages) return;
            console.log("pagination nextButton: ", value);
            responseState.activePage = value + 1;
          }
        });

      localforage.setItem("byblos-activePage", responseState.activePage).then((_) => {
        responseDispatch({
          type: responseActions.setActivePage,
          payload: { responseState },
        });
        window.scrollTo(0, 0);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePageJumpBttnClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const pageToJumpTo = Number(formData.get("bttn-pageJump"));

    if (pageToJumpTo < 1 || pageToJumpTo > numberOfPages) return;

    responseState.activePage = pageToJumpTo;

    try {
      // localforage.setItem("responseState", responseState).then((_) => {
      //   window.scrollTo(0, 0);
      // });

      localforage.setItem("byblos-activePage", responseState.activePage).then((_) => {
        window.scrollTo(0, 0);
      });
    } catch (error) {
      console.error("MyPagination component error", error);
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
            <Button disabled={activePage === 1} onClick={handlePrevPageBttnClick}>
              Prev
            </Button>
          </Center>
        </Grid.Col>
        <Grid.Col span={1}>
          <Center style={{ width: "100%", height: "100%" }}>
            <Text>
              Page: {activePage} of {numberOfPages}
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={1}>
          <Center>
            <Button
              disabled={activePage === numberOfPages}
              onClick={handleNextPageBttnClick}
            >
              Next
            </Button>
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

              <Button type="submit">Jump to</Button>
            </Center>
          </Grid.Col>

          <Grid.Col span={1}></Grid.Col>
        </Grid>
      </form>
    </Fragment>
  );
}

export { MyPagination };
