import { Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
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
import DisplayGeneric from "../displayGeneric";

type AuthorCollectionProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function AuthorCollection({
  children,
  allStates,
  allActions,
  allDispatches,
}: AuthorCollectionProps) {
  const { responseState, historyState } = allStates;
  const { responseDispatch, historyDispatch } = allDispatches;
  const { responseActions, historyActions } = allActions;
  const {
    responseState: { selectedVolume },
  } = allStates;
  const [authorCollection, setAuthorCollection] = useState<
    VolumeWithCustomId[]
  >([]);

  const navigate = useNavigate();
  const { width = 0 } = useWindowSize();
  const { volumeId } = useParams();

  useEffect(() => {
    const fetchAuthorCollection = async () => {
      try {
        const fetchUrlWithAuthor = `https://www.googleapis.com/books/v1/volumes?q=${
          allStates.responseState.selectedAuthor
        }+inauthor:${selectedVolume?.volumeInfo.authors.join(
          ","
        )}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithAuthor :", fetchUrlWithAuthor);

        const { data } = await axios.get(fetchUrlWithAuthor);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.authorCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithAuthor;

        try {
          await localforage.setItem("byblos-searchResults", data);

          await localforage.setItem("byblos-fetchUrl", fetchUrlWithAuthor);
        } catch (error: any) {
          const error_ = new Error(error, {
            cause: "inner try block inside fetchAuthorCollection()",
          });

          console.group("Error in authorCollection useEffect");
          console.error("name: ", error_.name);
          console.error("message: ", error_.message);
          console.error("cause: ", error_.cause);
          console.groupCollapsed("stack trace");
          console.trace(error_);
          console.error("detailed stack trace", error_.stack);
          console.groupEnd();
        } finally {
          allDispatches.responseDispatch({
            type: allActions.responseActions.setAll,
            payload: { responseState: allStates.responseState },
          });
          setAuthorCollection(itemsWithCustomId);
        }
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "outer try block inside fetchAuthorCollection()",
        });

        console.group("Error in authorCollection useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchAuthorCollection();
  }, []);

  //handles browser back button click and is included here separately from the function inside pagination component's useEffect because the pagination component is not rendered here
  useEffect(() => {
    const onBackButtonEvent = async (event: PopStateEvent) => {
      event.preventDefault();
    };

    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  return (
    <Fragment>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other volumes of ${
              allStates.responseState.selectedAuthor ??
              authorCollection[0]?.volumeInfo.authors[0] ??
              ""
            }`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other volumes of ${
                allStates.responseState.selectedAuthor ??
                authorCollection[0]?.volumeInfo.authors[0] ??
                ""
              }`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}

export default AuthorCollection;
