import { Rating, useMantineTheme } from "@mantine/core";

import { TbMoodCry } from "react-icons/tb";
import { TbMoodSad } from "react-icons/tb";
import { TbMoodSmile } from "react-icons/tb";
import { TbMoodHappy } from "react-icons/tb";
import { TbMoodCrazyHappy } from "react-icons/tb";
import { TbMoodEmpty } from "react-icons/tb";

type MyRatingProps = {
  children?: React.ReactNode;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
};

function MyRating({ children, value, onChange }: MyRatingProps) {
  const getEmptyIcon = (value: number) => {
    const defaultProps = {
      size: 24,
      color: "gray",
    };
    switch (value) {
      case 1:
        return <TbMoodCry {...defaultProps} />;
      case 2:
        return <TbMoodSad {...defaultProps} />;
      case 3:
        return <TbMoodSmile {...defaultProps} />;
      case 4:
        return <TbMoodHappy {...defaultProps} />;
      case 5:
        return <TbMoodCrazyHappy {...defaultProps} />;
      default:
        return <TbMoodEmpty {...defaultProps} />;
    }
  };

  const getFullIcon = (value: number) => {
    const defaultProps = {
      size: 24,
    };
    const theme = useMantineTheme();

    switch (value) {
      case 1:
        return <TbMoodCry {...defaultProps} color={theme.colors.red[7]} />;
      case 2:
        return <TbMoodSad {...defaultProps} color={theme.colors.orange[7]} />;
      case 3:
        return <TbMoodSmile {...defaultProps} color={theme.colors.yellow[7]} />;
      case 4:
        return <TbMoodHappy {...defaultProps} color={theme.colors.lime[7]} />;
      case 5:
        return (
          <TbMoodCrazyHappy {...defaultProps} color={theme.colors.green[7]} />
        );
      default:
        return <TbMoodEmpty {...defaultProps} />;
    }
  };

  return (
    <Rating
      emptySymbol={getEmptyIcon}
      fullSymbol={getFullIcon}
      highlightSelectedOnly
      value={value}
      onChange={onChange}
    />
  );
}

export default MyRating;
