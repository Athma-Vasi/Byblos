import { Flex, Text, TextInput } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  ResponseActions,
  ResponseDispatch,
  ResponseState,
} from "../../types";

type SearchProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Search({
  allStates: { responseState, themeState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  async function handleEnterKeyInput(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      window.scrollTo(0, 0);

      try {
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

        navigate(`/home/displayResults/1`);
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
          width < 576 ? "xs" : width < 768 ? "sm" : width < 992 ? "md" : "lg"
        }`}
        rightSection={rightInputSection(
          searchTerm,
          setSearchTerm,
          responseState,
          responseDispatch,
          responseActions
        )}
        rightSectionWidth={100}
        onKeyDown={handleEnterKeyInput}
        data-textinput="search"
        data-autofocus
      />
      <Link
        to={`/home/advancedSearch`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Text color={themeState.theme === "light" ? "dark.7" : "gray.7"}>
          Advanced Search
        </Text>
      </Link>
    </Flex>
  );
}

export { Search };

function rightInputSection(
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  responseState: ResponseState,
  responseDispatch: React.Dispatch<ResponseDispatch>,
  responseActions: ResponseActions
) {
  const navigate = useNavigate();
  async function handleSearchIconClick(
    event: React.MouseEvent<SVGElement, MouseEvent>
  ) {
    window.scrollTo(0, 0);

    try {
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

      navigate(`/home/displayResults/1`);
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
            color: "GrayText",
            transform: "scale(1.5)",
            cursor: "pointer",
          }}
          onClick={() => {
            setSearchTerm("");
          }}
        />
      )}
      {searchTerm === "" ? (
        ""
      ) : (
        <RxDividerVertical
          style={{ color: "GrayText", transform: "scale(1.5)" }}
        />
      )}
      <CgSearch
        style={{
          color: "GrayText",
          transform: "scale(1.25)",
          cursor: "pointer",
        }}
        onClick={handleSearchIconClick}
      />
    </Flex>
  );
}

export default Search;
