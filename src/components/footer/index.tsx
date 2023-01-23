import { Footer } from "@mantine/core";

type MyFooterProps = { children?: React.ReactNode };

function MyFooter({ children }: MyFooterProps) {
  return (
    <Footer height={60} p="md">
      Application footer
    </Footer>
  );
}

export { MyFooter };
