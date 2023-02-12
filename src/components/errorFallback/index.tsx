import { Button, Flex, Space, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

type ErrorFallbackProps = {
  children?: React.ReactNode;
  error?: any;
  componentName: string;
};

function ErrorFallback({ children, componentName, error }: ErrorFallbackProps) {
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
