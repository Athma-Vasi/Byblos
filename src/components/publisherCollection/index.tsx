import axios from "axios";
import { useEffect, Fragment, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useWindowSize } from "../../hooks/useWindowSize";
import { AllStates, AllActions, AllDispatches } from "../../types";
import { insertCustomId } from "../../utils";
import DisplayGeneric from "../displayGeneric";
import { MyPagination } from "../pagination";
import { Text } from "@mantine/core";

type PublisherCollectionProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function PublisherCollection({
  children,
  allStates,
  allActions,
  allDispatches,
}: PublisherCollectionProps) {
  const {
    responseState: { selectedVolume },
  } = allStates;

  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchOtherPublisherVolumes = async () => {
      console.log("publisher:", selectedVolume?.volumeInfo.publisher);
      try {
        const fetchUrlWithPublisher = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.selectedAuthor}+inpublisher:${selectedVolume?.volumeInfo.publisher}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        allStates.responseState.fetchUrl = fetchUrlWithPublisher;

        const { data } = await axios.get(fetchUrlWithPublisher);

        console.log(
          "fetchUrl from publisherCollection: ",
          allStates.responseState.fetchUrl,
        );
        console.log("data: ", data);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        allStates.responseState.publisherCollection = itemsWithCustomId;
        allDispatches.responseDispatch({
          type: allActions.responseActions.setAll,
          payload: { responseState: allStates.responseState },
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchOtherPublisherVolumes();
  }, []);
  return (
    <Fragment>
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
            volumes={allStates.responseState.otherEditions ?? []}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default PublisherCollection;
