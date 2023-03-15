import { Flex, Text, TextInput } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine, RiSearchEyeLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  NavlinksState,
  ResponseState,
  ThemeState,
} from "../../types";
import { toggleCurrentlyActiveNavlink } from "../../utils";

type SearchProps = {
  children?: React.ReactNode;
  themeState: ThemeState;
  responseState: ResponseState;
  navlinksState: NavlinksState;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Search({
  themeState,
  responseState,
  navlinksState,
  allActions,
  allDispatches,
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  let { theme } = themeState;
  let { responseActions, navlinksActions } = allActions;
  let { responseDispatch, navlinksDispatch } = allDispatches;

  async function handleEnterKeyInput(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      window.scrollTo(0, 0);

      //sets currently active navlink and all other navlinks to false
      toggleCurrentlyActiveNavlink(
        navlinksState,
        navlinksActions,
        navlinksDispatch
      );

      try {
        if (searchTerm === "") return;

        const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40&startIndex=0&key=${
          import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
        }`;
        const { data } = await axios.get(fetchUrlFromGenericSearch);

        responseState.startIndex = 0;
        responseState.searchTerm = searchTerm;
        responseState.searchResults = data as ApiResponseVolume;

        //initializes localforage keys to initial responseState values for some, and fetched values for others
        await localforage.setItem<ResponseState["startIndex"]>(
          "byblos-startIndex",
          responseState.startIndex
        );

        await localforage.setItem<ResponseState["searchTerm"]>(
          "byblos-searchTerm",
          responseState.searchTerm
        );
        await localforage.setItem<ResponseState["searchResults"]>(
          "byblos-searchResults",
          data as ApiResponseVolume
        );

        responseDispatch({
          type: responseActions.setAll,
          payload: {
            responseState: {
              ...responseState,
            },
          },
        });

        navigate(`/home/displayResults`);
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "handleEnterKeyInput()",
        });

        console.group("Error in search eventHandler");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    }
  }

  return (
    <Flex gap="md" justify="center" align="center">
      <TextInput
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.currentTarget.value);
        }}
        size={`${
          width < 576 ? "sm" : width < 768 ? "md" : width < 992 ? "lg" : "lg"
        }`}
        rightSection={rightInputSection({
          searchTerm,
          setSearchTerm,
          themeState,
          responseState,
          navlinksState,
          allActions,
          allDispatches,
        })}
        rightSectionWidth={100}
        onKeyDown={handleEnterKeyInput}
        data-autofocus
        data-cy="searchInput"
      />
      <Link
        to={`/home/advancedSearch`}
        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
        onClick={() =>
          toggleCurrentlyActiveNavlink(
            navlinksState,
            navlinksActions,
            navlinksDispatch
          )
        }
      >
        {/* <Text
          color={themeState.theme === "light" ? "dark.5" : "gray.5"}
          size={width < 576 ? "sm" : "md"}
          data-cy="button-advancedSearch"
        >
          Advanced Search
        </Text> */}
        <RiSearchEyeLine
          size={21}
          style={{
            color: `${theme === "light" ? "#B06519" : "#B87333"}`,
            marginTop: "4px",
          }}
        />
      </Link>
    </Flex>
  );
}

export { Search };

type RightInputSectionProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  themeState: ThemeState;
  responseState: ResponseState;
  navlinksState: NavlinksState;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function rightInputSection({
  searchTerm,
  setSearchTerm,
  themeState,
  responseState,
  navlinksState,
  allActions,
  allDispatches,
}: RightInputSectionProps) {
  const navigate = useNavigate();

  let { theme } = themeState;
  let { responseActions, navlinksActions } = allActions;
  let { responseDispatch, navlinksDispatch } = allDispatches;

  async function handleSearchIconClick(
    event: React.MouseEvent<SVGElement, MouseEvent>
  ) {
    window.scrollTo(0, 0);

    //sets currently active navlink and all other navlinks to false
    toggleCurrentlyActiveNavlink(
      navlinksState,
      navlinksActions,
      navlinksDispatch
    );

    try {
      if (searchTerm === "") return;

      const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40&startIndex=0&key=${
        import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      }`;
      const { data } = await axios.get(fetchUrlFromGenericSearch);

      responseState.startIndex = 0;
      responseState.searchTerm = searchTerm;
      responseState.searchResults = data as ApiResponseVolume;

      //initializes localforage keys to initial responseState values for some, and fetched values for others
      await localforage.setItem<ResponseState["startIndex"]>(
        "byblos-startIndex",
        responseState.startIndex
      );

      await localforage.setItem<ResponseState["searchTerm"]>(
        "byblos-searchTerm",
        responseState.searchTerm
      );

      await localforage.setItem<ResponseState["searchResults"]>(
        "byblos-searchResults",
        data as ApiResponseVolume
      );

      responseDispatch({
        type: responseActions.setAll,
        payload: {
          responseState: {
            ...responseState,
          },
        },
      });

      navigate(`/home/displayResults`);
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleSearchIconClick()",
      });

      console.group("Error in search rightInputSection() eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  return (
    <Flex gap="xs">
      {searchTerm === "" ? (
        ""
      ) : (
        <RiCloseLine
          style={{
            color: `${theme === "light" ? "#B06519" : "#B87333"}`,
            transform: "scale(1.5)",
            cursor: "pointer",
          }}
          onClick={() => {
            setSearchTerm("");
          }}
          data-cy="closeIcon"
        />
      )}
      {searchTerm === "" ? (
        ""
      ) : (
        <RxDividerVertical
          style={{
            color: `${theme === "light" ? "#B06519" : "#B87333"}`,
            transform: "scale(1.5)",
          }}
          data-cy="dividerIcon"
        />
      )}
      <CgSearch
        style={{
          color: `${theme === "light" ? "#B06519" : "#B87333"}`,
          transform: "scale(1.25)",
          cursor: "pointer",
        }}
        data-cy="searchIcon"
        onClick={handleSearchIconClick}
      />
    </Flex>
  );
}

export default Search;
