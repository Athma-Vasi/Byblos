import { NavlinksActions, NavlinksDispatch, NavlinksState } from "../../types";

const initialNavlinksState: NavlinksState = {
  isMyLibraryActive: false,
  isBookshelfActive: false,
  isFavouritesActive: false,
  isRatedActive: false,
  isMarkReadActive: false,
  isReadLaterActive: false,
};

const navlinksActions: NavlinksActions = {
  setIsMyLibraryActive: "setIsMyLibraryActive",
  setIsBookshelfActive: "setIsBookshelfActive",
  setIsFavouritesActive: "setIsFavouritesActive",
  setIsRatedActive: "setIsRatedActive",
  setIsMarkReadActive: "setIsMarkReadActive",
  setIsReadLaterActive: "setIsReadLaterActive",
};

function navlinksReducer(
  navlinksState: NavlinksState,
  navlinksDispatch: NavlinksDispatch
) {
  const {
    isMyLibraryActive,
    isBookshelfActive,
    isFavouritesActive,
    isRatedActive,
    isMarkReadActive,
    isReadLaterActive,
  } = navlinksState;

  switch (navlinksDispatch.type) {
    case navlinksActions.setIsMyLibraryActive: {
      return {
        ...navlinksState,
        isMyLibraryActive: !isMyLibraryActive,
        isBookshelfActive: false,
        isFavouritesActive: false,
        isRatedActive: false,
        isMarkReadActive: false,
        isReadLaterActive: false,
      };
    }

    case navlinksActions.setIsBookshelfActive: {
      return {
        ...navlinksState,
        isBookshelfActive: !isBookshelfActive,
        isMyLibraryActive: false,
        isFavouritesActive: false,
        isRatedActive: false,
        isMarkReadActive: false,
        isReadLaterActive: false,
      };
    }

    case navlinksActions.setIsFavouritesActive: {
      return {
        ...navlinksState,
        isFavouritesActive: !isFavouritesActive,
        isMyLibraryActive: false,
        isBookshelfActive: false,
        isRatedActive: false,
        isMarkReadActive: false,
        isReadLaterActive: false,
      };
    }

    case navlinksActions.setIsRatedActive: {
      return {
        ...navlinksState,
        isRatedActive: !isRatedActive,
        isMyLibraryActive: false,
        isBookshelfActive: false,
        isFavouritesActive: false,
        isMarkReadActive: false,
        isReadLaterActive: false,
      };
    }

    case navlinksActions.setIsMarkReadActive: {
      return {
        ...navlinksState,
        isMarkReadActive: !isMarkReadActive,

        isMyLibraryActive: false,
        isBookshelfActive: false,
        isFavouritesActive: false,
        isRatedActive: false,
        isReadLaterActive: false,
      };
    }

    case navlinksActions.setIsReadLaterActive: {
      return {
        ...navlinksState,
        isReadLaterActive: !isReadLaterActive,
        isMyLibraryActive: false,
        isBookshelfActive: false,
        isFavouritesActive: false,
        isRatedActive: false,
        isMarkReadActive: false,
      };
    }

    default: {
      return {
        isMyLibraryActive: false,
        isBookshelfActive: false,
        isFavouritesActive: false,
        isRatedActive: false,
        isMarkReadActive: false,
        isReadLaterActive: false,
      };
    }
  }
}

export { initialNavlinksState, navlinksActions, navlinksReducer };
