import { Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { Suspense } from "react";
import { Fragment, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import { MyImageModal } from "../myImageModal";
import { MyPagination } from "../pagination";

const DisplayGeneric = React.lazy(() => import("../displayGeneric"));

type OtherEditionsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function OtherEditions({
  children,
  allStates,
  allActions,
  allDispatches,
}: OtherEditionsProps) {
  const {
    responseState: { selectedVolume, selectedAuthor },
  } = allStates;

  const [otherEditions, setOtherEditions] = useState<VolumeWithCustomId[]>([]);
  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchOtherEditions = async () => {
      console.log("title:", selectedVolume?.volumeInfo.title);
      try {
        const fetchUrlWithName = `https://www.googleapis.com/books/v1/volumes?q=${selectedVolume?.volumeInfo.title}+inauthor:${selectedAuthor}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        const { data } = await axios.get(fetchUrlWithName);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        allStates.responseState.otherEditions = itemsWithCustomId;

        try {
          localforage.setItem<ResponseState>("responseState", allStates.responseState);
        } catch (error) {
          console.error(error);
        } finally {
          allDispatches.responseDispatch({
            type: allActions.responseActions.setAll,
            payload: { responseState: allStates.responseState },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOtherEditions(allStates.responseState.otherEditions ?? []);
      }
    };

    fetchOtherEditions();
  }, []);

  return (
    <div>
      <Title order={3}>Other editions</Title>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other editions of ${allStates.responseState.selectedVolume}`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other editions of ${allStates.responseState.selectedVolume}`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
            volumes={allStates.responseState.otherEditions ?? otherEditions}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </div>
  );
}

export default OtherEditions;
