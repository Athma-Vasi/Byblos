import {
  Center,
  Flex,
  Grid,
  Highlight,
  Image,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates, VolumeWithCustomId } from "../../types";
import { MyImageModal } from "../myImageModal";

type DisplayGenericProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
  volumes: VolumeWithCustomId[];
};

function DisplayGeneric({
  children,
  volumes,
  allStates,
  allActions,
  allDispatches,
}: DisplayGenericProps) {
  const { width = 0 } = useWindowSize();

  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  const navigate = useNavigate();

  function handleTitleClick(volume: VolumeWithCustomId) {
    allStates.responseState.searchTerm = volume.volumeInfo.title;
    allStates.responseState.selectedVolume = volume;
    allDispatches.responseDispatch({
      type: allActions.responseActions.setSelectedVolume,
      payload: { responseState: allStates.responseState },
    });

    navigate(`/home/displayVolume/${volume.customId}`);
  }

  return (
    <Fragment>
      <MyImageModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        src={modalSrc}
        alt={modalAlt}
      />
      <Flex gap="xl" direction="column">
        {volumes.map((item) => (
          <Grid key={item.customId} columns={9}>
            <Grid.Col span={width < 992 ? 2 : 1}>
              <Center>
                <Image
                  style={{ cursor: "pointer" }}
                  src={item.volumeInfo.imageLinks?.thumbnail}
                  alt={`thumbnail of ${
                    item.volumeInfo.title ?? "unavailable"
                  } book cover`}
                  onClick={() => {
                    setModalSrc(item.volumeInfo.imageLinks?.thumbnail ?? "");
                    setModalAlt(item.volumeInfo.title);
                    setModalOpened(true);
                  }}
                  withPlaceholder
                  placeholder={<Text align="center">No image available</Text>}
                />
              </Center>
            </Grid.Col>
            <Grid.Col span={width < 992 ? 7 : 8}>
              <Title
                order={3}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleTitleClick(item);
                }}
              >
                {item.volumeInfo.title}
              </Title>
              {item.volumeInfo.authors?.map((author) => (
                <Text key={author} style={{ cursor: "pointer" }}>
                  {author}
                </Text>
              ))}
              <Text>
                {new Date(item.volumeInfo.publishedDate).getFullYear().toString()}
              </Text>
              <Spoiler
                maxHeight={100}
                showLabel="Show more"
                hideLabel="Hide"
                transitionDuration={382}
              >
                <Highlight highlight={allStates.responseState.searchTerm.split(" ")}>
                  {item.volumeInfo.description ?? "Description unavailable"}
                </Highlight>
              </Spoiler>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
    </Fragment>
  );
}

export default DisplayGeneric;
