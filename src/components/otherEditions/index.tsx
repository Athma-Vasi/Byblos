import { Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { Suspense } from "react";
import { Fragment, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";

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
  const { volumeId, page } = useParams();

  const [otherEditions, setOtherEditions] = useState<VolumeWithCustomId[]>([]);
  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchOtherEditions = async () => {
      try {
        const fetchUrlWithName = `https://www.googleapis.com/books/v1/volumes?q=${
          selectedVolume?.volumeInfo.title ?? otherEditions[0].volumeInfo.title
        }+inauthor:${
          selectedAuthor ?? otherEditions[0].volumeInfo.authors[0]
        }&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithName from otherEditions", fetchUrlWithName);

        const { data } = await axios.get(fetchUrlWithName);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        allStates.responseState.otherEditions = itemsWithCustomId;
        allStates.responseState.fetchUrl = fetchUrlWithName;
        allStates.responseState.activePage = 1;

        try {
          await localforage.setItem<ResponseState["otherEditions"]>(
            "byblos-otherEditions",
            allStates.responseState.otherEditions
          );

          await localforage.setItem<ResponseState["fetchUrl"]>(
            "byblos-fetchUrl",
            allStates.responseState.fetchUrl
          );

          await localforage.setItem<ResponseState["activePage"]>(
            "byblos-activePage",
            allStates.responseState.activePage
          );
        } catch (error) {
          console.error("Error setting otherEditions to localforage ", error);
        } finally {
          allDispatches.responseDispatch({
            type: allActions.responseActions.setAll,
            payload: { responseState: allStates.responseState },
          });
        }
      } catch (error) {
        console.error("Error fetching other editions", error);
      } finally {
        setOtherEditions(allStates.responseState.otherEditions ?? []);
      }
    };

    fetchOtherEditions();
  }, []);

  const modifiedSearchResults = insertCustomId(
    allStates?.responseState?.otherEditions ?? []
  );

  return (
    <div>
      <Title order={3}>Other editions</Title>
      <ErrorBoundary
        fallback={<Text>{`Unable to display other editions`}</Text>}
      >
        <Suspense fallback={<Text>{`Loading other editions`}</Text>}>
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
            volumes={modifiedSearchResults ?? otherEditions}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        parentPath={`/home/displayVolume/${volumeId}/otherEditions/`}
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </div>
  );
}

export default OtherEditions;
