import { Flex, Grid, Loader, Space, Text } from "@mantine/core";
import React from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import { showRandomProgress } from "../../utils";

type MyLoaderProps = {
  children?: React.ReactNode;
  componentName: string;
};

function MyLoader({ componentName }: MyLoaderProps) {
  const { width = 0 } = useWindowSize();

  const { value, art } = showRandomProgress();

  return (
    <Grid columns={10}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="sm" />
      ))}
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={8}>
        <Flex direction="column" align="center" justify="center">
          <Loader size={width < 576 ? "lg" : "xl"} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Space key={i} h="sm" />
          ))}

          <Text> Please wait ... </Text>
          <Text color="#B06519">
            {art} {value}%
          </Text>
          <Text> ... loading</Text>
          <Text> {componentName} </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
    </Grid>
  );
}

export default MyLoader;
