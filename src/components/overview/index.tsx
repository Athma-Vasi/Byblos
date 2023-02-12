import {
  Card,
  Grid,
  Space,
  Text,
  Image,
  Flex,
  Button,
  Title,
} from "@mantine/core";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { AiFillBook, AiOutlineAmazon, AiOutlineGoogle } from "react-icons/ai";
import { FcKindle } from "react-icons/fc";
import { CgEreader, CgSearch } from "react-icons/cg";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { getLanguageFromCode } from "../../utils";
import { VscOpenPreview } from "react-icons/vsc";

type OverviewProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Overview({ allStates }: OverviewProps) {
  const { width = 0 } = useWindowSize();

  //used as backup if selectedVolume is null
  const [selectedVolumeForage, setSelectedVolumeForage] =
    useState<VolumeWithCustomId | null>(null);

  const {
    responseState: { selectedVolume },
    themeState: { theme },
  } = allStates;

  useEffect(() => {
    const fetchSelectedVolumeFromLocalForage = async () => {
      try {
        await localforage
          .getItem<ResponseState["selectedVolume"]>("byblos-selectedVolume")
          .then((value) => {
            if (value) {
              setSelectedVolumeForage(value);
            }
          });
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "fetchSelectedVolumeFromLocalForage()",
        });

        console.group("Error in overview useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchSelectedVolumeFromLocalForage();
  }, []);

  /**
   * logic inside jsx is moved outside to make it more readable. selectedVolume from responseState is used first, if it is null, then selectedVolume from localforage is used.
   */
  const imageSrc =
    selectedVolume?.volumeInfo.imageLinks?.thumbnail ??
    selectedVolumeForage?.volumeInfo.imageLinks?.thumbnail ??
    "";
  const imageAlt = selectedVolume
    ? selectedVolume?.volumeInfo.title
      ? `thumbnail of ${selectedVolume?.volumeInfo.title}`
      : "thumbnail unavailable"
    : selectedVolumeForage?.volumeInfo.title
    ? `thumbnail of ${selectedVolumeForage?.volumeInfo.title}`
    : "thumbnail unavailable";

  const industryIdentifiers = selectedVolume
    ? selectedVolume?.volumeInfo?.industryIdentifiers?.map((id) => (
        <Text
          key={id?.identifier}
          color={theme === "light" ? "dark.6" : "gray.5"}
          data-cy="industryIdentifier-overview"
        >
          {id?.type?.includes("ISBN")
            ? `${id?.type?.split("_").join("-")}`
            : "Other"}
          :{" "}
          {id?.identifier?.toLowerCase().includes(":")
            ? id?.identifier?.split(":")[1]
            : id?.identifier?.toLowerCase()}
          <Space h="xs" />
        </Text>
      ))
    : selectedVolumeForage?.volumeInfo?.industryIdentifiers?.map((id) => (
        <Text
          key={id?.identifier}
          color={theme === "light" ? "dark.6" : "gray.5"}
          data-cy="industryIdentifier-overview"
        >
          {id?.type?.includes("ISBN")
            ? `${id?.type?.split("_").join("-")}`
            : "Other"}
          :{" "}
          {id?.identifier?.toLowerCase().includes(":")
            ? id?.identifier?.split(":")[1]
            : id?.identifier?.toLowerCase()}
          <Space h="xs" />
        </Text>
      ));

  let publishedDate = selectedVolume
    ? Number.isNaN(
        new Date(selectedVolume?.volumeInfo?.publishedDate ?? "").getFullYear()
      )
      ? "Unavailable"
      : new Date(selectedVolume?.volumeInfo?.publishedDate ?? "")
          .getFullYear()
          .toString()
    : Number.isNaN(
        new Date(
          selectedVolumeForage?.volumeInfo?.publishedDate ?? ""
        ).getFullYear()
      )
    ? "Unavailable"
    : new Date(selectedVolumeForage?.volumeInfo?.publishedDate ?? "")
        .getFullYear()
        .toString();
  publishedDate = publishedDate === "NaN" ? "Unavailable" : publishedDate;

  const publisher = selectedVolume
    ? selectedVolume?.volumeInfo.publisher ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.publisher ?? "Unavailable";

  const pageCount = selectedVolume
    ? selectedVolume?.volumeInfo.pageCount ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.pageCount ?? "Unavailable";

  const authors = selectedVolume
    ? selectedVolume?.volumeInfo.authors?.join(", ") ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.authors?.join(", ") ?? "Unavailable";

  const printType = selectedVolume
    ? `${selectedVolume?.volumeInfo?.printType.slice(
        0,
        1
      )}${selectedVolume?.volumeInfo.printType.toLowerCase().slice(1)}` ??
      "Unavailable"
    : `${selectedVolumeForage?.volumeInfo?.printType.slice(
        0,
        1
      )}${selectedVolumeForage?.volumeInfo.printType.toLowerCase().slice(1)}` ??
      "Unavailable";

  const categories = selectedVolume
    ? selectedVolume?.volumeInfo.categories?.join(", ") ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.categories?.join(", ") ?? "Unavailable";

  const language = selectedVolume
    ? getLanguageFromCode(selectedVolume?.volumeInfo.language) ?? "Unavailable"
    : getLanguageFromCode(selectedVolumeForage?.volumeInfo.language ?? "") ??
      "Unavailable";

  const averageRating = selectedVolume
    ? selectedVolume?.volumeInfo.averageRating ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.averageRating ?? "Unavailable";

  const ratingsCount = selectedVolume
    ? selectedVolume?.volumeInfo.ratingsCount ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.ratingsCount ?? "Unavailable";

  const maturityRating = selectedVolume
    ? `${selectedVolume?.volumeInfo.maturityRating.slice(
        0,
        1
      )}${selectedVolume?.volumeInfo.maturityRating
        .toLowerCase()
        .split("_")
        .join(" ")
        .slice(1)}` ?? "Unavailable"
    : `${selectedVolumeForage?.volumeInfo.maturityRating.slice(
        0,
        1
      )}${selectedVolumeForage?.volumeInfo.maturityRating
        .toLowerCase()
        .split("_")
        .join(" ")
        .slice(1)}` ?? "Unavailable";

  const amazonLink = selectedVolume
    ? `https://www.amazon.ca/gp/search?index=books&keywords=${
        selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier
          : selectedVolume?.volumeInfo.title
      }`
    : `https://www.amazon.ca/gp/search?index=books&keywords=${
        selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]
              ?.identifier
          : selectedVolumeForage?.volumeInfo.title
      }`;

  const chaptersLink = selectedVolume
    ? `https://www.chapters.indigo.ca/en-ca/books/product/${
        selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier
          : selectedVolume?.volumeInfo.title
      }-item.html?s_campaign=Google_BookSearch_organic`
    : `https://www.chapters.indigo.ca/en-ca/books/product/${
        selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]
              ?.identifier
          : selectedVolumeForage?.volumeInfo.title
      }-item.html?s_campaign=Google_BookSearch_organic`;

  const googleBooksLink = selectedVolume
    ? selectedVolume?.volumeInfo.canonicalVolumeLink
    : selectedVolumeForage?.volumeInfo.canonicalVolumeLink;

  const googleBooksPreview = selectedVolume
    ? selectedVolume?.volumeInfo.previewLink
    : selectedVolumeForage?.volumeInfo.previewLink;

  const googleBooksEpub = selectedVolume
    ? selectedVolume?.accessInfo?.epub?.isAvailable
      ? selectedVolume?.accessInfo?.epub?.acsTokenLink
      : "Unavailable"
    : selectedVolumeForage?.accessInfo?.epub?.isAvailable
    ? selectedVolumeForage?.accessInfo?.epub?.acsTokenLink
    : "Unavailable";

  const googleBooksWebReader = selectedVolume
    ? selectedVolume?.accessInfo?.webReaderLink
    : selectedVolumeForage?.accessInfo?.webReaderLink;

  const aboutEditionDesktop = (
    <Grid columns={width < 576 ? 1 : 3} align="center">
      <Grid.Col span={1}>
        <Image
          width={width < 576 ? "50%" : "75%"}
          src={imageSrc}
          alt={imageAlt}
          radius="xs"
          data-cy="imageThumbnail-overview"
        />
      </Grid.Col>

      <Grid.Col span={1}>
        <Grid columns={width < 576 ? 2 : 1}>
          <Grid.Col span={1}>
            {industryIdentifiers}
            <Text
              color={theme === "light" ? "dark.6" : "gray.5"}
              data-cy="published-overview"
            >
              Published: {publishedDate}
              <Space h="xs" />
            </Text>
          </Grid.Col>

          <Grid.Col span={1}>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Publisher: {publisher}
              <Space h="xs" />
            </Text>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Pages: {pageCount}
              <Space h="xs" />
            </Text>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Author: {authors}
              <Space h="xs" />
            </Text>
          </Grid.Col>
        </Grid>
      </Grid.Col>

      <Grid.Col span={1}>
        <Grid columns={width < 576 ? 2 : 1}>
          <Grid.Col span={1}>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Print type: {printType}
              <Space h="xs" />
            </Text>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Categories: {categories}
              <Space h="xs" />
            </Text>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Language: {language}
              <Space h="xs" />
            </Text>
          </Grid.Col>

          <Grid.Col span={1}>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Average rating: {averageRating}
              <Space h="xs" />
            </Text>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Ratings count: {ratingsCount}
              <Space h="xs" />
            </Text>
            <Text color={theme === "light" ? "dark.6" : "gray.5"}>
              Maturity rating: {maturityRating}
              <Space h="xs" />
            </Text>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );

  const aboutEditionMobile = (
    <Flex direction="column" align="flex-start" justify="center">
      <Image
        width={width < 576 ? "50%" : "75%"}
        src={imageSrc}
        alt={imageAlt}
        radius="xs"
        data-cy="imageThumbnail-overview"
      />

      <Space h="lg" />

      {industryIdentifiers}
      <Text
        color={theme === "light" ? "dark.6" : "gray.5"}
        data-cy="published-overview"
      >
        Published: {publishedDate}
        <Space h="xs" />
      </Text>

      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Publisher: {publisher}
        <Space h="xs" />
      </Text>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Pages: {pageCount}
        <Space h="xs" />
      </Text>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Author: {authors}
        <Space h="xs" />
      </Text>

      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Print type: {printType}
        <Space h="xs" />
      </Text>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Categories: {categories}
        <Space h="xs" />
      </Text>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Language: {language}
        <Space h="xs" />
      </Text>

      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Average rating: {averageRating}
        <Space h="xs" />
      </Text>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Ratings count: {ratingsCount}
        <Space h="xs" />
      </Text>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        Maturity rating: {maturityRating}
        <Space h="xs" />
      </Text>
    </Flex>
  );

  const getBookDesktop = (
    <Card shadow="sm" radius="md" style={{ width: "100%" }}>
      <Flex direction="row" justify="space-between" align="center">
        <Flex direction="row" justify="start" align="center">
          <AiOutlineAmazon size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>Amazon.ca</Text>
        </Flex>

        <a href={amazonLink} target="_blank">
          <Button
            variant="outline"
            radius="lg"
            leftIcon={<CgSearch size={18} />}
          >
            Search Amazon.ca
          </Button>
        </a>
      </Flex>

      <Space h="sm" />

      <Flex direction="row" justify="space-between" align="center">
        <Flex direction="row" justify="start" align="center">
          <AiFillBook size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Chapters Indigo
          </Text>
        </Flex>

        <a href={chaptersLink} target="_blank">
          <Button
            variant="outline"
            radius="lg"
            leftIcon={<CgSearch size={18} />}
          >
            Search Chapters Indigo
          </Button>
        </a>
      </Flex>

      <Space h="sm" />

      <Flex direction="row" justify="space-between" align="center">
        <Flex direction="row" justify="start" align="center">
          <AiOutlineGoogle size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Google Books
          </Text>
        </Flex>

        <a href={googleBooksLink} target="_blank">
          <Button
            variant="outline"
            radius="lg"
            leftIcon={<CgSearch size={18} />}
          >
            Search Google Books
          </Button>
        </a>
      </Flex>
    </Card>
  );

  const getBookMobile = (
    <Card shadow="sm" radius="md" style={{ width: "100%" }}>
      <Flex direction="column" align="start" justify="center">
        {/* amazon section */}
        <Flex direction="row" justify="start" align="center">
          <AiOutlineAmazon size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>Amazon.ca</Text>
        </Flex>

        <Space h="xs" />

        <a href={amazonLink} target="_blank">
          <Button
            variant="outline"
            radius="lg"
            leftIcon={<CgSearch size={18} />}
          >
            Search Amazon.ca
          </Button>
        </a>

        <Space h="lg" />
        <Space h="lg" />

        {/* chapters section */}
        <Flex direction="row" justify="start" align="center">
          <AiFillBook size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Chapters Indigo
          </Text>
        </Flex>

        <Space h="sm" />

        <a href={chaptersLink} target="_blank">
          <Button
            variant="outline"
            radius="lg"
            leftIcon={<CgSearch size={18} />}
          >
            Search Chapters Indigo
          </Button>
        </a>

        <Space h="lg" />
        <Space h="lg" />

        {/* google books section */}
        <Flex direction="row" justify="start" align="center">
          <AiOutlineGoogle size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Google Books
          </Text>
        </Flex>

        <Space h="sm" />

        <a href={googleBooksLink} target="_blank">
          <Button
            variant="outline"
            radius="lg"
            leftIcon={<CgSearch size={18} />}
          >
            Search Google Books
          </Button>
        </a>
      </Flex>
    </Card>
  );

  const previewsDesktop = (
    <Card shadow="sm" radius="md" style={{ width: "100%" }}>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        {"Google Books (may require authorization)"}
      </Text>

      <Space h="sm" />

      <Flex direction="row" justify="space-between" align="center">
        <Flex direction="row" justify="start" align="center">
          <VscOpenPreview size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Sample preview
          </Text>
        </Flex>

        <a href={googleBooksPreview} target="_blank">
          <Button variant="outline" radius="xl">
            View sample preview online
          </Button>
        </a>
      </Flex>

      <Space h="sm" />

      <Flex direction="row" justify="space-between" align="center">
        <Flex direction="row" justify="start" align="center">
          <CgEreader size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Web reader
          </Text>
        </Flex>

        <a href={googleBooksWebReader} target="_blank">
          <Button variant="outline" radius="xl">
            View sample using Google's web reader
          </Button>
        </a>
      </Flex>

      <Space h="sm" />

      <Flex direction="row" justify="space-between" align="center">
        <Flex direction="row" justify="start" align="center">
          <FcKindle size={28} style={{ color: "GrayText" }} />
          <Space w="xl" />
          <Text color={theme === "light" ? "dark.6" : "gray.5"}>
            Epub sample
          </Text>
        </Flex>

        <a href={googleBooksEpub} target="_blank">
          <Button variant="outline" radius="xl">
            Free epub sample download
          </Button>
        </a>
      </Flex>
    </Card>
  );

  const previewsMobile = (
    <Card shadow="sm" radius="md" style={{ width: "100%" }}>
      <Text color={theme === "light" ? "dark.6" : "gray.5"}>
        {"Google Books (may require authorization)"}
      </Text>

      <Space h="lg" />

      <Flex direction="row" justify="flex-start" align="center">
        <VscOpenPreview size={28} style={{ color: "GrayText" }} />
        <Space w="xl" />
        <Text color={theme === "light" ? "dark.6" : "gray.5"}>
          Sample preview
        </Text>
      </Flex>

      <Space h="sm" />

      <a href={googleBooksPreview} target="_blank">
        <Button variant="outline" radius="xl">
          View sample preview online
        </Button>
      </a>

      <Space h="lg" />
      <Space h="lg" />

      <Flex direction="row" justify="flex-start" align="center">
        <CgEreader size={28} style={{ color: "GrayText" }} />
        <Space w="xl" />
        <Text color={theme === "light" ? "dark.6" : "gray.5"}>Web reader</Text>
      </Flex>

      <Space h="sm" />

      <a href={googleBooksWebReader} target="_blank">
        <Button variant="outline" radius="xl">
          View sample with Google's web reader
        </Button>
      </a>

      <Space h="lg" />
      <Space h="lg" />

      <Flex direction="row" justify="flex-start" align="center">
        <FcKindle size={28} style={{ color: "GrayText" }} />
        <Space w="xl" />
        <Text color={theme === "light" ? "dark.6" : "gray.5"}>Epub sample</Text>
      </Flex>

      <Space h="sm" />

      <a href={googleBooksEpub} target="_blank">
        <Button variant="outline" radius="xl">
          Free epub sample download
        </Button>
      </a>
    </Card>
  );

  return (
    <Flex
      direction="column"
      p={width < 576 ? "sm" : "md"}
      style={{ width: "100%" }}
    >
      <Space h="xs" />

      <Flex direction="row" justify={width < 576 ? "center" : "flex-start"}>
        <Title
          order={4}
          color={theme === "light" ? "dark.6" : "gray.5"}
          data-cy="aboutThisEdition-overview"
        >
          About this edition
        </Title>
        <Space h="xs" />
      </Flex>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        {width < 576 ? aboutEditionMobile : aboutEditionDesktop}
      </Card>

      <Space h="lg" />
      <Space h="lg" />

      <Flex direction="row" justify={width < 576 ? "center" : "flex-start"}>
        <Title order={4} color={theme === "light" ? "dark.6" : "gray.5"}>
          Get book
        </Title>
        <Space h="xs" />
      </Flex>
      {width < 576 ? getBookMobile : getBookDesktop}

      <Space h="lg" />
      <Space h="lg" />

      <Flex direction="row" justify={width < 576 ? "center" : "flex-start"}>
        <Title order={4} color={theme === "light" ? "dark.6" : "gray.5"}>
          Previews
        </Title>
        <Space h="xs" />
      </Flex>
      {width < 576 ? previewsMobile : previewsDesktop}
    </Flex>
  );
}

export default Overview;
