import { Button, Center, Grid, NumberInput, Space, Text } from "@mantine/core";
import axios from "axios";
import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize";

import { AllActions, AllDispatches, AllStates } from "../../types";

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
  const { searchTerm, fetchUrl, activePage, searchResults, resultsPerPage } =
    responseState;
  const navigate = useNavigate();

  const totalItems = searchResults?.totalItems ?? 0;
  const numberOfPages = Math.ceil(totalItems / Number(resultsPerPage));
  //this index is only evaluated when the page changes; on initial render, it is not used
  const startIndex = activePage * Number(resultsPerPage) - Number(resultsPerPage);

  useEffect(() => {
    if (searchTerm && fetchUrl) {
      const fetchUsingStartIndex = async () => {
        // const startIndexAddedToFetchUrl = fetchUrl + `&startIndex=${startIndex}`;

        // console.log("fetching using startIndex: ", startIndexAddedToFetchUrl);

        const [first, ...rest] = fetchUrl.split("&");
        const startIndexAddedToFetchUrl = `${first}&startIndex=${startIndex}&${rest.join(
          "&",
        )}`;

        try {
          const { data } = await axios.get(startIndexAddedToFetchUrl);

          responseState.activePage = activePage;
          responseState.searchResults = data;
          responseDispatch({
            type: responseActions.setAll,
            payload: { responseState },
          });

          console.log("data: ", data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUsingStartIndex();

      //scroll to top of page
      window.scrollTo(0, 0);

      //navigate to the page
      navigate(`/home/displayResults/${activePage}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  function handlePrevPageBttnClick() {
    // event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    if (activePage === 1) return;
    responseState.activePage = activePage - 1;
    responseDispatch({
      type: responseActions.setActivePage,
      payload: { responseState },
    });

    //scroll to top of page
    window.scrollTo(0, 0);

    //navigate to the page
    navigate(`/home/displayResults/${activePage}`);
  }

  function handleNextPageBttnClick() {
    // event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    if (activePage === numberOfPages) return;
    responseState.activePage = activePage + 1;
    responseDispatch({
      type: responseActions.setActivePage,
      payload: { responseState },
    });

    //scroll to top of page
    window.scrollTo(0, 0);

    //navigate to the page
    navigate(`/home/displayResults/${activePage}`);
  }

  function handlePageJumpBttnClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const pageToJumpTo = Number(formData.get("bttn-pageJump"));

    if (pageToJumpTo < 1 || pageToJumpTo > numberOfPages) return;

    responseState.activePage = pageToJumpTo;
    responseDispatch({
      type: responseActions.setActivePage,
      payload: { responseState },
    });

    //scroll to top of page
    window.scrollTo(0, 0);

    //navigate to the page
    navigate(`/home/displayResults/${activePage}`);
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
