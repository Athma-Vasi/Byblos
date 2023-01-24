import { Button, Flex, Text, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

import { Link, useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { responseActions } from "../state";
import { AllActions, AllDispatches, AllStates, ApiResponseVolume } from "../types";

type WelcomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Welcome({
  children,
  allStates: { responseState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: WelcomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  async function handleEnterKeyInput(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      responseState.searchTerm = searchTerm;
      responseDispatch({
        type: responseActions.setSearchTerm,
        payload: {
          responseState,
        },
      });

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`,
      );
      const data: ApiResponseVolume = await response.json();

      responseState.searchResults = data;
      responseDispatch({
        type: responseActions.setSearchResults,
        payload: {
          responseState,
        },
      });

      console.log(responseState.searchResults);

      // take user to home page
      navigate("/home");
    }
  }

  return (
    <div>
      <Title order={1}>Byblos</Title>
      <TextInput
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.currentTarget.value);
        }}
        size={`${width < 576 ? "xs" : width < 768 ? "sm" : width < 992 ? "md" : "lg"}`}
        rightSection={rightInputSection(searchTerm)}
        rightSectionWidth={searchTerm === "" ? 50 : 100}
        onKeyDown={handleEnterKeyInput}
      />
      <Link to={`/home`}>
        <Button>Search</Button>
      </Link>
      <Title
        order={3}
      >{`Search the world's most comprehensive list of volumes powered by Google Books`}</Title>
    </div>
  );
}

export { Welcome };

function rightInputSection(searchTerm: string) {
  async function handleSearchIconClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
    //
  }

  return (
    <Flex gap="xs">
      {searchTerm === "" ? (
        ""
      ) : (
        <RiCloseLine
          style={{ color: "GrayText", transform: "scale(1.5)", cursor: "pointer" }}
        />
      )}
      {searchTerm === "" ? (
        ""
      ) : (
        <RxDividerVertical style={{ color: "GrayText", transform: "scale(1.5)" }} />
      )}
      <CgSearch
        style={{ color: "GrayText", transform: "scale(1.25)", cursor: "pointer" }}
        onClick={handleSearchIconClick}
      />
    </Flex>
  );
}
