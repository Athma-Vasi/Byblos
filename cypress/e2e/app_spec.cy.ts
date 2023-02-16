import { mount } from "cypress/react18";

//➯➯ denotes transition from one component to another

describe("Advanced Search page ", () => {
  describe("parameter specificity modifiers", () => {
    it("should render Advanced Search page", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get("[data-textinput='find-allWords']").should("exist");
    });

    it("should display text when user enters chars in find-allWords input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-allWords']").type("Cordelia's Honor");
      cy.get("[data-textinput='find-allWords']").should(
        "have.value",
        "Cordelia's Honor"
      );
    });

    it("should display text when user enters chars in find-exactPhrase input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-exactPhrase']").type("Paladin of Souls");
      cy.get("[data-textinput='find-exactPhrase']").should(
        "have.value",
        "Paladin of Souls"
      );
    });

    it("should display text when user enters chars in find-atLeastOne input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-atLeastOne']").type("Snow Crash");
      cy.get("[data-textinput='find-atLeastOne']").should(
        "have.value",
        "Snow Crash"
      );
    });

    it("should display text when user enters chars in find-none input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-none']").type("The Uplift War");
      cy.get("[data-textinput='find-none']").should(
        "have.value",
        "The Uplift War"
      );
    });

    it("should display '10' upon initial render in resultsPerPage input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-nativeselect='resultsPerPage']").should("have.value", "10");
    });

    it("should display '20' when user selects '20' in resultsPerPage input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-nativeselect='resultsPerPage']").select("20");
      cy.get("[data-nativeselect='resultsPerPage']").should("contain", "20");
    });

    it("should display '30' when user selects '30' in resultsPerPage input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-nativeselect='resultsPerPage']").select("30");
      cy.get("[data-nativeselect='resultsPerPage']").should("contain", "30");
    });

    it("should display '40' when user selects '40' in resultsPerPage input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-nativeselect='resultsPerPage']").select("40");
      cy.get("[data-nativeselect='resultsPerPage']").should("contain", "40");
    });
  });

  describe("download format modifiers", () => {
    it("should have 'All books' selected upon initial render", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-allBooksFormat']").should("be.checked");
    });

    it("should have 'All books' selected when user selects 'All books'", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-allBooksFormat']").click();
      cy.get("[data-radioinput='filter-allBooksFormat']").should("be.checked");
    });

    it("should have 'Epub' selected when user selects 'Epub'", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-epubFormat']").click();
      cy.get("[data-radioinput='filter-epubFormat']").should("be.checked");
    });

    it("should display dropdown with text when user mouse over the 'All books' radio button", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-allBooksFormat']").trigger("mouseover");
      cy.get("[data-radioinput='filter-allBooksFormat-dropdown']").should(
        "have.text",
        "Default: does not restrict and returns all books"
      );
    });

    it("should display dropdown with text when user mouse over the 'Epub' radio button", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-epubFormat']").trigger("mouseover");
      cy.get("[data-radioinput='filter-epubFormat-dropdown']").should(
        "have.text",
        "Only returns results that have an available epub download format"
      );
    });
  });

  describe("book views modifiers", () => {
    it("should have 'All books' selected upon initial render", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-allBooks']").should("be.checked");
    });
    describe("should have ${} selected when user selects ${}", () => {
      it("'All books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allBooks']").click();
        cy.get("[data-radioinput='filter-allBooks']").should("be.checked");
      });

      it("'Partial books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-partialBooks']").click();
        cy.get("[data-radioinput='filter-partialBooks']").should("be.checked");
      });

      it("'Full books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-fullBooks']").click();
        cy.get("[data-radioinput='filter-fullBooks']").should("be.checked");
      });

      it("'Free eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-freeEbooks']").click();
        cy.get("[data-radioinput='filter-freeEbooks']").should("be.checked");
      });

      it("'Paid eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-paidEbooks']").click();
        cy.get("[data-radioinput='filter-paidEbooks']").should("be.checked");
      });

      it("'All eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allEbooks']").click();
        cy.get("[data-radioinput='filter-allEbooks']").should("be.checked");
      });
    });

    describe("should display dropdown with text when user mouse over ...", () => {
      it("'All books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allBooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-allBooks-dropdown']").should(
          "have.text",
          "Default: does not restrict and returns all books"
        );
      });

      it("'Partial books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-partialBooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-partialBooks-dropdown']").should(
          "have.text",
          "Returns results where at least part of the text is previewable."
        );
      });

      it("'Full books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-fullBooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-fullBooks-dropdown']").should(
          "have.text",
          "Only returns results where all of the text is viewable."
        );
      });

      it("'Free eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-freeEbooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-freeEbooks-dropdown']").should(
          "have.text",
          "Only returns results that are free Google eBooks."
        );
      });

      it("'Paid eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-paidEbooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-paidEbooks-dropdown']").should(
          "have.text",
          "Only returns results that are Google eBooks with a price."
        );
      });

      it("'All eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allEbooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-allEbooks-dropdown']").should(
          "have.text",
          `Returns all Google eBooks, both free and paid. Examples of non-eBooks would be publisher content that is available in limited preview and not for sale, or magazines.`
        );
      });
    });
  });

  describe("publication type modifiers", () => {
    it("should have 'All types' selected upon initial render", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-allContent']").should("be.checked");
    });

    describe("should have ${} selected when user selects ${}", () => {
      it("'All types' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allContent']").click();
        cy.get("[data-radioinput='filter-allContent']").should("be.checked");
      });

      it("'Books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-books']").click();
        cy.get("[data-radioinput='filter-books']").should("be.checked");
      });

      it("'Magazines' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-magazines']").click();
        cy.get("[data-radioinput='filter-magazines']").should("be.checked");
      });
    });

    describe("should display dropdown with text when user mouse over ...", () => {
      it("'All types' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allContent']").trigger("mouseover");
        cy.get("[data-radioinput='filter-allContent-dropdown']").should(
          "have.text",
          "Default: does not restrict and returns all publication types"
        );
      });

      it("'Books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-books']").trigger("mouseover");
        cy.get("[data-radioinput='filter-books-dropdown']").should(
          "have.text",
          "Returns only results that are books."
        );
      });

      it("'Magazines' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-magazines']").trigger("mouseover");
        cy.get("[data-radioinput='filter-magazines-dropdown']").should(
          "have.text",
          "Returns only results that are magazines."
        );
      });
    });
  });

  describe("book volumes general modifiers", () => {
    describe("should have text in ${} inputs", () => {
      it("'title''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='title']").type("A Fire Upon the Deep");
        cy.get("[data-textinput='title']").should(
          "have.value",
          "A Fire Upon the Deep"
        );
      });

      it("'author''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='author']").type("Vernor Vinge");
        cy.get("[data-textinput='author']").should(
          "have.value",
          "Vernor Vinge"
        );
      });

      it("'publisher''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='publisher']").type("Tor Books");
        cy.get("[data-textinput='publisher']").should(
          "have.value",
          "Tor Books"
        );
      });

      it("'isbn''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='isbn']").type("9780765376479");
        cy.get("[data-textinput='isbn']").should("have.value", "9780765376479");
      });

      it("'lccn''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='lccn']").type("2001044843");
        cy.get("[data-textinput='lccn']").should("have.value", "2001044843");
      });

      it("'oclc''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='oclc']").type("123456789");
        cy.get("[data-textinput='oclc']").should("have.value", "123456789");
      });
    });

    describe("should display dropdown with text when user mouse over ...", () => {
      it("'title''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='title']").trigger("mouseover");
        cy.get("[data-textinput='title-dropdown']").should(
          "have.text",
          "Search for books that contain this word or phrase in the title."
        );
      });

      it("'author''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='author']").trigger("mouseover");
        cy.get("[data-textinput='author-dropdown']").should(
          "have.text",
          "Search for books that contain this word or phrase in the author's name."
        );
      });

      it("'publisher''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='publisher']").trigger("mouseover");
        cy.get("[data-textinput='publisher-dropdown']").should(
          "have.text",
          "Search for books that contain this word or phrase in the publisher's name."
        );
      });

      it("'subject'", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='subject']").trigger("mouseover");
        cy.get("[data-textinput='subject-dropdown']").should(
          "have.text",
          `Search for books that contain this word or phrase within a category. Example: 'science-fiction'`
        );
      });

      it("'isbn''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='isbn']").trigger("mouseover");
        cy.get("[data-textinput='isbn-dropdown']").should(
          "have.text",
          "Search for books that match this ISBN. The International Standard Book Number is a unique product identifier used in the publishing industry to identify the registrant as well as the specific title, edition and format. Example: '978-0671578282'"
        );
      });

      it("'lccn''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='lccn']").trigger("mouseover");
        cy.get("[data-textinput='lccn-dropdown']").should(
          "have.text",
          "Search for books that match this LCCN. A Library of Congress Control Number is assigned to a book while the book is being catalogued by the Library of Congress, if it has been selected for addition to the Library's collections. Example: '96024819'"
        );
      });

      it("'oclc''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='oclc']").trigger("mouseover");
        cy.get("[data-textinput='oclc-dropdown']").should(
          "have.text",
          "Search for books that match this OCLC number. Online Computer Library Center is a cooperative, computerized network for libraries and provide bibliographic, abstract and full-text information. They also maintain the Dewey Decimal Classification system. Example: '42320675'"
        );
      });
    });
  });
});

describe("Welcome page", () => {
  it("should have the following items", () => {
    cy.visit("localhost:5173/");
    //logo
    cy.get("[data-cy='logo-welcome']").should("be.visible");
    //slogan
    cy.get("[data-cy='slogan-welcome']").should("be.visible");
    //search input
    cy.get("[data-cy='searchInput']").should("be.visible");
    //search icon
    cy.get("[data-cy='searchIcon']").should("be.visible");
    //close icon
    cy.get("[data-cy='searchInput']").type("test");
    cy.get("[data-cy='closeIcon']").should("be.visible");
    //clear search input and close icon should disappear
    cy.get("[data-cy='searchInput']").clear();
    cy.get("[data-cy='closeIcon']").should("not.exist");
    //divider icon should appear
    cy.get("[data-cy='searchInput']").type("test");
    cy.get("[data-cy='dividerIcon']").should("be.visible");
    //clear search input and divider icon should disappear
    cy.get("[data-cy='searchInput']").clear();
    cy.get("[data-cy='dividerIcon']").should("not.exist");
  });

  it('should take the user to the advanced search page when the "Advanced Search" button is clicked', () => {
    cy.visit("localhost:5173/");
    cy.get("[data-cy='button-advancedSearch']").click();
    cy.url().should("include", "/home/advancedSearch");
  });
});

describe("Header component", () => {
  it("should have a logo", () => {
    cy.visit("localhost:5173/home");
    cy.get('[data-cy="logo-header"]').should("be.visible");
  });

  it("should have a search text input", () => {
    cy.visit("localhost:5173/home");
    cy.get('[data-cy="searchInput"]').should("be.visible");
  });

  //mobile viewport
  describe("mobile viewport", () => {
    it("should have a dropdown arrow menu icon", () => {
      cy.viewport("iphone-6");
      cy.visit("localhost:5173/home");
      cy.get('[data-cy="dropdownArrow"]').should("exist");
    });
  });

  it("should have a theme switch", () => {
    cy.visit("localhost:5173/home");
    cy.get('[data-cy="themeSwitch"]').should("exist");
  });
});

describe("AdvancedSearch ➯➯ DisplayGeneric", () => {
  describe('when author "c.j. cherryh" is entered in author field: ', () => {
    it("should display appropriate fields in displayed card", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get("[data-textinput='author']").clear().type("c.j. cherryh");
      cy.get("[data-cy='advancedSearch-searchButton']").click();

      //title
      cy.get("[data-cy='title-volume']").should("exist");
      //image thumbnail
      cy.get("[data-cy='image-thumbnail']").should("exist");
      //author
      cy.get("[data-cy='author-volume']").should("exist");
      //published year
      cy.get("[data-cy='publishedYear-volume']").should("exist");
      //description
      cy.get("[data-cy='description-volume']").should("exist");
      //spoiler
      cy.get("[data-cy='spoiler-volume']").should("exist");
      //dropdown icon
      cy.get("[data-cy='dropdownIcon-volume']").should("exist");
      //dropdown menu
      cy.get("[data-cy='dropdownMenu-volume']").should("exist");
    });

    it("should display appropriate sections when dropdown icon is clicked", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get("[data-textinput='author']").clear().type("c.j. cherryh");
      cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
      cy.get("[data-cy='dropdownIcon-volume']").first().click().wait(500);

      //rate
      cy.get("[data-cy='rate-dropDownMenu']").first().should("exist");
      //favourite
      cy.get("[data-cy='favourite-dropDownMenu']").first().should("exist");
      //read later
      cy.get("[data-cy='readLater-dropDownMenu']").first().should("exist");
      //mark read
      cy.get("[data-cy='markRead-dropDownMenu']").first().should("exist");
      //remove
      cy.get('[data-cy="remove-dropDownMenu"]').first().should("exist");
    });
  });
});

describe("AdvancedSearch ➯➯ DisplayGeneric ➯➯ DisplayVolume ", () => {
  describe('when author "c.j. cherryh" is entered in author field and title `Divergence` is clicked ', () => {
    it("should have a `Menu` and children navlinks", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get("[data-textinput='author']").clear().type("c.j. cherryh");
      cy.get("[data-cy='advancedSearch-searchButton']").click();
      cy.get("[data-cy='title-volume']").first().click();
      //menu navlink
      cy.get("[data-cy='menu-displayVolume']").should("exist");
      cy.get("[data-cy='menu-displayVolume']").click();
      //children navlinks
      cy.get("[data-cy='menu-overview-displayVolume']").should("exist");
      cy.get("[data-cy='menu-menu-otherEditions-displayVolume']").should(
        "exist"
      );
      cy.get("[data-cy='menu-authorCollection-displayVolume']").should("exist");
      cy.get('[data-cy="menu-authorCollection-displayVolume"]').should("exist");
    });

    it("should have `About this edition` section and appropriate fields", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get('[data-textinput="author"]').clear().type("c.j. cherryh");
      cy.get('[data-cy="advancedSearch-searchButton"]').click();
      cy.get('[data-cy="title-volume"]').first().click();
      //title of section
      cy.get('[data-cy="aboutThisEdition-overview"]').should("exist");
      //image thumbnail
      cy.get('[data-cy="imageThumbnail-overview"]').should("exist");
      //industry identifier (ISBN or OTHER)
      cy.get('[data-cy="industryIdentifier-overview"]').should("exist");
      //published date
      cy.get('[data-cy="published-overview"]').should("exist");
      //publisher
      cy.get('[data-cy="publisher-overview"]').should("exist");
      //page count
      cy.get('[data-cy="pageCount-overview"]').should("exist");
      //author
      cy.get('[data-cy="author-overview"]').should("exist");
      //print type
      cy.get('[data-cy="printType-overview"]').should("exist");
      //categories
      cy.get('[data-cy="categories-overview"]').should("exist");
      //language
      cy.get('[data-cy="language-overview"]').should("exist");
      //average rating
      cy.get('[data-cy="averageRating-overview"]').should("exist");
      //ratings count
      cy.get('[data-cy="ratingsCount-overview"]').should("exist");
      //maturity rating
      cy.get('[data-cy="maturityRating-overview"]').should("exist");
    });

    it("should have `Get book` section and appropriate fields", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get('[data-textinput="author"]').clear().type("c.j. cherryh");
      cy.get('[data-cy="advancedSearch-searchButton"]').click();
      cy.get('[data-cy="title-volume"]').first().click();

      //title of section
      cy.get('[data-cy="getBook-overview"]').should("exist");
      //amazon logo
      cy.get('[data-cy="amazonLogo-overview"]').should("exist");
      //amazon text
      cy.get('[data-cy="amazonText-overview"]').should("exist");
      //amazon link
      cy.get('[data-cy="amazonLink-overview"]').should("exist");
      //url should have `amazon` in it
      cy.get('[data-cy="amazonLink-overview"]')
        .should("have.attr", "href")
        .and("include", "amazon");
      //chapters logo
      cy.get('[data-cy="chaptersLogo-overview"]').should("exist");
      //chapters text
      cy.get('[data-cy="chaptersText-overview"]').should("exist");
      //chapters link
      cy.get('[data-cy="chaptersLink-overview"]').should("exist");
      //url should have `chapters` in it
      cy.get('[data-cy="chaptersLink-overview"]')
        .should("have.attr", "href")
        .and("include", "chapters");
      //google logo
      cy.get('[data-cy="googleLogo-overview"]').should("exist");
      //google text
      cy.get('[data-cy="googleText-overview"]').should("exist");
      //google link
      cy.get('[data-cy="googleLink-overview"]').should("exist");
      //url should have `google` in it
      cy.get('[data-cy="googleLink-overview"]')
        .should("have.attr", "href")
        .and("include", "google");
    });

    it("should have a `Previews` section and appropriate fields", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get('[data-textinput="author"]').clear().type("c.j. cherryh");
      cy.get('[data-cy="advancedSearch-searchButton"]').click();
      cy.get('[data-cy="title-volume"]').first().click();

      //title of section
      cy.get('[data-cy="previews-overview"]').should("exist");
      //sample preview logo
      cy.get('[data-cy="samplePreviewLogo-overview"]').should("exist");
      //sample preview text
      cy.get('[data-cy="samplePreviewText-overview"]').should("exist");
      //sample preview link
      cy.get('[data-cy="samplePreviewLink-overview"]').should("exist");
      //url should have `books.google` in it
      cy.get('[data-cy="samplePreviewLink-overview"]')
        .should("have.attr", "href")
        .and("include", "books.google");
      //web reader logo
      cy.get('[data-cy="webReaderLogo-overview"]').should("exist");
      //web reader text
      cy.get('[data-cy="webReaderText-overview"]').should("exist");
      //web reader link
      cy.get('[data-cy="webReaderLink-overview"]').should("exist");
      //url should have `play.google` in it
      cy.get('[data-cy="webReaderLink-overview"]')
        .should("have.attr", "href")
        .and("include", "play.google");
      //epub sample logo
      cy.get('[data-cy="epubSampleLogo-overview"]').should("exist");
      //epub sample text
      cy.get('[data-cy="epubSampleText-overview"]').should("exist");
      //epub sample link
      cy.get('[data-cy="epubSampleLink-overview"]').should("exist");
    });
  });
});

describe("AdvancedSearch ➯➯ DisplayGeneric ➯➯ DisplayVolume ➯➯ OtherEditions", () => {
  it("should display appropriate fields in displayed card", () => {
    cy.visit("localhost:5173/home/advancedSearch");
    cy.get("[data-textinput='author']").clear();
    cy.get("[data-textinput='author']").type("c.j. cherryh");
    cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
    cy.get("[data-cy='title-volume']").first().click().wait(500);
    cy.get("[data-cy='menu-displayVolume']").click();
    cy.get("[data-cy='menu-otherEditions-displayVolume']").click();

    //title
    cy.get("[data-cy='title-volume']").should("exist");
    //image thumbnail
    cy.get("[data-cy='image-thumbnail']").should("exist");
    //author
    cy.get("[data-cy='author-volume']").should("exist");
    //published year
    cy.get("[data-cy='publishedYear-volume']").should("exist");
    //description
    cy.get("[data-cy='description-volume']").should("exist");
    //spoiler
    cy.get("[data-cy='spoiler-volume']").should("exist");
    //dropdown icon
    cy.get("[data-cy='dropdownIcon-volume']").should("exist");
    //dropdown menu
    cy.get("[data-cy='dropdownMenu-volume']").should("exist");
  });

  it("should display appropriate sections when dropdown icon is clicked", () => {
    cy.visit("localhost:5173/home/advancedSearch");
    cy.get("[data-textinput='author']").clear();
    cy.get("[data-textinput='author']").type("c.j. cherryh");
    cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
    cy.get("[data-cy='title-volume']").first().click().wait(500);

    cy.get("[data-cy='menu-displayVolume']").click();
    cy.get("[data-cy='menu-otherEditions-displayVolume']").click();
    //rate
    cy.get("[data-cy='rate-dropDownMenu']").first().should("exist");
    //favourite
    cy.get("[data-cy='favourite-dropDownMenu']").first().should("exist");
    //read later
    cy.get("[data-cy='readLater-dropDownMenu']").first().should("exist");
    //mark read
    cy.get("[data-cy='markRead-dropDownMenu']").first().should("exist");
    //remove
    cy.get('[data-cy="remove-dropDownMenu"]').first().should("exist");
  });
});

describe("AdvancedSearch ➯➯ DisplayGeneric ➯➯ DisplayVolume ➯➯ PublisherCollection", () => {
  it("should display appropriate fields in displayed card", () => {
    cy.visit("localhost:5173/home/advancedSearch");
    cy.get("[data-textinput='author']").clear();
    cy.get("[data-textinput='author']").type("c.j. cherryh");
    cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
    cy.get("[data-cy='title-volume']").first().click().wait(500);
    cy.get("[data-cy='menu-displayVolume']").click();
    cy.get("[data-cy='menu-authorCollection-displayVolume']").click();

    //title
    cy.get("[data-cy='title-volume']").should("exist");
    //image thumbnail
    cy.get("[data-cy='image-thumbnail']").should("exist");
    //author
    cy.get("[data-cy='author-volume']").should("exist");
    //published year
    cy.get("[data-cy='publishedYear-volume']").should("exist");
    //description
    cy.get("[data-cy='description-volume']").should("exist");
    //spoiler
    cy.get("[data-cy='spoiler-volume']").should("exist");
    //dropdown icon
    cy.get("[data-cy='dropdownIcon-volume']").should("exist");
    //dropdown menu
    cy.get("[data-cy='dropdownMenu-volume']").should("exist");
  });

  it("should display appropriate sections when dropdown icon is clicked", () => {
    cy.visit("localhost:5173/home/advancedSearch");
    cy.get("[data-textinput='author']").clear();
    cy.get("[data-textinput='author']").type("c.j. cherryh");
    cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
    cy.get("[data-cy='title-volume']").first().click().wait(500);

    cy.get("[data-cy='menu-displayVolume']").click();
    cy.get("[data-cy='menu-authorCollection-displayVolume']").click();
    //rate
    cy.get("[data-cy='rate-dropDownMenu']").first().should("exist");
    //favourite
    cy.get("[data-cy='favourite-dropDownMenu']").first().should("exist");
    //read later
    cy.get("[data-cy='readLater-dropDownMenu']").first().should("exist");
    //mark read
    cy.get("[data-cy='markRead-dropDownMenu']").first().should("exist");
    //remove
    cy.get('[data-cy="remove-dropDownMenu"]').first().should("exist");
  });
});

describe("AdvancedSearch ➯➯ DisplayGeneric ➯➯ DisplayVolume ➯➯ AuthorCollection", () => {
  it("should display appropriate fields in displayed card", () => {
    cy.visit("localhost:5173/home/advancedSearch");
    cy.get("[data-textinput='author']").clear();
    cy.get("[data-textinput='author']").type("c.j. cherryh");
    cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
    cy.get("[data-cy='title-volume']").first().click().wait(500);
    cy.get("[data-cy='menu-displayVolume']").click();
    cy.get("[data-cy='menu-authorCollection-displayVolume']").click();

    //title
    cy.get("[data-cy='title-volume']").should("exist");
    //image thumbnail
    cy.get("[data-cy='image-thumbnail']").should("exist");
    //author
    cy.get("[data-cy='author-volume']").should("exist");
    //published year
    cy.get("[data-cy='publishedYear-volume']").should("exist");
    //description
    cy.get("[data-cy='description-volume']").should("exist");
    //spoiler
    cy.get("[data-cy='spoiler-volume']").should("exist");
    //dropdown icon
    cy.get("[data-cy='dropdownIcon-volume']").should("exist");
    //dropdown menu
    cy.get("[data-cy='dropdownMenu-volume']").should("exist");
  });

  it("should display appropriate sections when dropdown icon is clicked", () => {
    cy.visit("localhost:5173/home/advancedSearch");
    cy.get("[data-textinput='author']").clear();
    cy.get("[data-textinput='author']").type("c.j. cherryh");
    cy.get("[data-cy='advancedSearch-searchButton']").click().wait(500);
    cy.get("[data-cy='title-volume']").first().click().wait(500);

    cy.get("[data-cy='menu-displayVolume']").click();
    cy.get("[data-cy='menu-authorCollection-displayVolume']").click();
    //rate
    cy.get("[data-cy='rate-dropDownMenu']").first().should("exist");
    //favourite
    cy.get("[data-cy='favourite-dropDownMenu']").first().should("exist");
    //read later
    cy.get("[data-cy='readLater-dropDownMenu']").first().should("exist");
    //mark read
    cy.get("[data-cy='markRead-dropDownMenu']").first().should("exist");
    //remove
    cy.get('[data-cy="remove-dropDownMenu"]').first().should("exist");
  });
});

describe("Navbar", () => {
  it("should display navbar", () => {
    cy.visit("localhost:5173/home");
    cy.get("[data-cy='navbar']").should("exist");
  });

  it("should display `My Library` and `Clear storage` in navbar", () => {
    cy.visit("localhost:5173/home");
    cy.get("[data-cy='navbar']").should("exist");
    cy.get("[data-cy='navlink-myLibrary']").should("exist");
    cy.get("[data-cy='navlink-clearStorage']").should("exist");
  });

  it("should display `My Library` children when clicked", () => {
    cy.visit("localhost:5173/home");

    cy.get("[data-cy='navlink-myLibrary']").click();
    cy.get("[data-cy='navlink-bookshelf']").should("exist");
    cy.get("[data-cy='navlink-favourites']").should("exist");
    cy.get("[data-cy='navlink-rated']").should("exist");
    cy.get("[data-cy='navlink-reading']").should("exist");
    cy.get("[data-cy='navlink-markRead']").should("exist");
    cy.get("[data-cy='navlink-readLater']").should("exist");
  });
});
