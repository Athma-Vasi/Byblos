import { Card, Grid, Space, Container, Text, Image } from "@mantine/core";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { AiOutlineAmazon, AiFillBook } from "react-icons/ai";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";

type OverviewProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Overview({ children, allStates, allActions, allDispatches }: OverviewProps) {
  const { width = 0 } = useWindowSize();

  const [selectedVolume, setSelectedVolume] = useState<VolumeWithCustomId | null>(null);

  useEffect(() => {
    const fetchSelectedVolumeFromLocalForage = async () => {
      try {
        localforage.getItem<ResponseState>("responseState").then((value) => {
          console.log("value from overview: ", value);
          if (value) {
            setSelectedVolume(value.selectedVolume);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchSelectedVolumeFromLocalForage();
  });

  return (
    <div>
      <Text align="start" size="lg">
        About this edition
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Grid columns={width < 576 ? 1 : 3}>
          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              <Image
                width={width < 576 ? "50%" : "75%"}
                src={selectedVolume?.volumeInfo.imageLinks?.thumbnail}
                alt={
                  selectedVolume?.volumeInfo.title === undefined
                    ? "thumbnail unavailable"
                    : `thumbnail of ${selectedVolume?.volumeInfo.title}`
                }
              />
            </Card.Section>
          </Grid.Col>

          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              {selectedVolume?.volumeInfo.industryIdentifiers?.map((id) => (
                <Text key={id.identifier}>
                  {id.type.includes("ISBN") ? `${id.type.split("_").join("-")}` : "Other"}
                  :{" "}
                  {id.identifier.toLowerCase().includes(":")
                    ? id.identifier.split(":")[1]
                    : id.identifier.toLowerCase()}
                  <Space h="xs" />
                </Text>
              ))}
              <Text>
                Published:
                {Number.isNaN(
                  new Date(selectedVolume?.volumeInfo?.publishedDate ?? "").getFullYear(),
                )
                  ? "Unavailable"
                  : new Date(selectedVolume?.volumeInfo?.publishedDate ?? "")
                      .getFullYear()
                      .toString()}
                <Space h="xs" />
              </Text>
              <Text>
                Publisher: {selectedVolume?.volumeInfo.publisher ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Pages: {selectedVolume?.volumeInfo.pageCount ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Author: {selectedVolume?.volumeInfo.authors?.join(", ") ?? "Unavailable"}
                <Space h="xs" />
              </Text>
            </Card.Section>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              <Text>
                Print type:{" "}
                {selectedVolume?.volumeInfo.printType.toLowerCase() ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Categories:{" "}
                {selectedVolume?.volumeInfo.categories?.join(", ") ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Language: {selectedVolume?.volumeInfo.language ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Average rating:{" "}
                {selectedVolume?.volumeInfo.averageRating ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Ratings count: {selectedVolume?.volumeInfo.ratingsCount ?? "Unavailable"}
                <Space h="xs" />
              </Text>
              <Text>
                Maturity rating:{" "}
                {selectedVolume?.volumeInfo.maturityRating
                  .toLowerCase()
                  .split("_")
                  .join(" ") ?? "Unavailable"}
                <Space h="xs" />
              </Text>
            </Card.Section>
          </Grid.Col>
        </Grid>
      </Card>

      <Space h="lg" />
      <Space h="lg" />

      <Text align="start" size="lg">
        Get book
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Grid columns={width < 576 ? 1 : 2}>
          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              <Container>
                <AiOutlineAmazon size={50} />
                <Text>Amazon.ca</Text>
                <a
                  href={`https://www.amazon.ca/gp/search?index=books&keywords=${selectedVolume?.volumeInfo.industryIdentifiers[0].identifier}`}
                >
                  Search Amazon.ca
                </a>
              </Container>

              <Container>
                <AiFillBook size={50} />
                <Text>Chapters Indigo</Text>
                <a
                  href={`https://www.chapters.indigo.ca/en-ca/books/product/${selectedVolume?.volumeInfo.industryIdentifiers[0].identifier}-item.html?s_campaign=Google_BookSearch_organic`}
                >
                  Search Chapters Indigo
                </a>
              </Container>
            </Card.Section>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
}

export default Overview;
