import { Button, Flex, Space, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

type ErrorFallbackProps = {
  children?: React.ReactNode;
  componentName: string;
};

function ErrorFallback({ componentName }: ErrorFallbackProps) {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text>❗ Error ❗</Text>

      <Space h="sm" />

      <Text>Something went wrong when retrieving {componentName}</Text>

      <Space h="sm" />

      <Button>
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          Try again 🔁
        </Link>
      </Button>
    </Flex>
  );
}

export default ErrorFallback;
