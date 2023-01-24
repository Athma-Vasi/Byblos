import { Button, Flex, Text, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

import { Link, useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { Search } from "../search";
import { responseActions } from "../state";
import { AllActions, AllDispatches, AllStates, ApiResponseVolume } from "../types";

type WelcomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Welcome({ children, allStates, allActions, allDispatches }: WelcomeProps) {
  const navigate = useNavigate();

  return (
    <div>
      <Title order={1}>Byblos</Title>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      <Title
        order={3}
      >{`Search the world's most comprehensive list of volumes powered by Google Books`}</Title>
    </div>
  );
}

export { Welcome };
