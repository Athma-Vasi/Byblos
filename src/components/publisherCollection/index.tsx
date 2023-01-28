import { AllStates, AllActions, AllDispatches } from "../../types";

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
  return <div>PublisherCollection</div>;
}

export default PublisherCollection;
