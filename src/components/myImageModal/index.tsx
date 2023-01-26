import { Image, Modal } from "@mantine/core";
import { Fragment } from "react";

type MyImageModalProps = {
  children?: React.ReactNode;
  src: string;
  alt: string;
  modalOpened: boolean;
  setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function MyImageModal({ modalOpened, setModalOpened, src, alt }: MyImageModalProps) {
  return (
    <Fragment>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="xs">
        <Image src={src} alt={alt} />
      </Modal>
    </Fragment>
  );
}

export { MyImageModal };
