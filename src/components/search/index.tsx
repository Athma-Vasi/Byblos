import { Flex, Text, TextInput } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  HistoryActions,
  HistoryDispatch,
  HistoryState,
  ResponseActions,
  ResponseDispatch,
  ResponseState,
  Volume,
} from "../../types";

type SearchProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Search({
  allStates: { responseState, historyState },
  allActions: { responseActions, historyActions },
  allDispatches: { responseDispatch, historyDispatch },
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  async function handleEnterKeyInput(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      console.log("searchTerm", searchTerm);

      try {
        const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;
        const { data } = await axios.get(fetchUrlFromGenericSearch);

        responseState.searchTerm = searchTerm;
        responseState.searchResults = data as ApiResponseVolume;
        responseState.fetchUrl = fetchUrlFromGenericSearch;

        //initializes localforage keys to initial responseState values for some, and fetched values for others

        await localforage.setItem("byblos-fetchUrl", fetchUrlFromGenericSearch);

        await localforage.setItem(
          "byblos-resultsPerPage",
          responseState.resultsPerPage
        );

        await localforage.setItem(
          "byblos-searchResults",
          data as ApiResponseVolume
        );

        await localforage.setItem(
          "byblos-searchTerm",
          responseState.searchTerm
        );
        await localforage.setItem(
          "byblos-selectedAuthor",
          responseState.selectedAuthor
        );
        await localforage.setItem(
          "byblos-selectedPublisher",
          responseState.selectedPublisher
        );
        await localforage.setItem(
          "byblos-selectedVolume",
          responseState.selectedVolume
        );
        responseDispatch({
          type: responseActions.setAll,
          payload: { responseState },
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
      } finally {
        //save the current state to history by pushing current responseState into the historyState stack
        historyDispatch({
          type: historyActions.pushHistory,
          payload: {
            historyState: {
              searchTerm: responseState.searchTerm,
              fetchUrl: responseState.fetchUrl,
              selectedVolume: responseState.selectedVolume,
              selectedAuthor: responseState.selectedAuthor,
              selectedPublisher: responseState.selectedPublisher,
              resultsPerPage: responseState.resultsPerPage,
              searchResults: responseState.searchResults,
            },
          },
        });
      }
    }
  }

  return (
    <Flex
      gap="md"
      justify="center"
      align="center"
      style={{ outline: "2px solid GrayText", width: "100%" }}
    >
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
          responseActions,
          historyState,
          historyActions,
          historyDispatch
        )}
        rightSectionWidth={100}
        onKeyDown={handleEnterKeyInput}
        data-textinput="search"
      />
      <Link to={`/home/advancedSearch`}>
        <Text>Advanced Search</Text>
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
  responseActions: ResponseActions,
  historyState: HistoryState,
  historyActions: HistoryActions,
  historyDispatch: React.Dispatch<HistoryDispatch>
) {
  const navigate = useNavigate();
  async function handleSearchIconClick(
    event: React.MouseEvent<SVGElement, MouseEvent>
  ) {
    try {
      const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;
      const { data } = await axios.get(fetchUrlFromGenericSearch);

      responseState.searchTerm = searchTerm;
      responseState.searchResults = data as ApiResponseVolume;
      responseState.fetchUrl = fetchUrlFromGenericSearch;

      //initializes localforage keys to initial responseState values for some, and fetched values for others

      await localforage.setItem("byblos-fetchUrl", fetchUrlFromGenericSearch);

      await localforage.setItem(
        "byblos-resultsPerPage",
        responseState.resultsPerPage
      );

      await localforage.setItem(
        "byblos-searchResults",
        data as ApiResponseVolume
      );

      await localforage.setItem("byblos-searchTerm", responseState.searchTerm);
      await localforage.setItem(
        "byblos-selectedAuthor",
        responseState.selectedAuthor
      );
      await localforage.setItem(
        "byblos-selectedPublisher",
        responseState.selectedPublisher
      );
      await localforage.setItem(
        "byblos-selectedVolume",
        responseState.selectedVolume
      );
      responseDispatch({
        type: responseActions.setAll,
        payload: { responseState },
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
    } finally {
      //save the current state to history by pushing current responseState into the historyState stack
      historyDispatch({
        type: historyActions.pushHistory,
        payload: {
          historyState: {
            searchTerm: responseState.searchTerm,
            fetchUrl: responseState.fetchUrl,
            selectedVolume: responseState.selectedVolume,
            selectedAuthor: responseState.selectedAuthor,
            selectedPublisher: responseState.selectedPublisher,
            resultsPerPage: responseState.resultsPerPage,
            searchResults: responseState.searchResults,
          },
        },
      });
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
