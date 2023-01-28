import axios from "axios";
import { useEffect } from "react";
import { AllActions, AllDispatches, AllStates } from "../../types";

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
  useEffect(() => {
    const {
      responseState: { selectedVolume, fetchUrl },
    } = allStates;
    const fetchOtherEditions = async () => {
      try {
        const fetchUrlWithName = `https://www.googleapis.com/books/v1/volumes?q=${selectedVolume?.volumeInfo.title}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        const { data } = await axios.get(fetchUrlWithName);

        console.log("data: ", data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOtherEditions();
  }, []);
  return <div>OtherEditions</div>;
}

export default OtherEditions;
