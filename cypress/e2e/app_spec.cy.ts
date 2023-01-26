import { mount } from "cypress/react18";

describe("Welcome page", () => {
  it("should render title and advertising blurb", () => {
    cy.visit("localhost:5173");
    cy.get("[data-cy='welcome-title']").should("exist");
  });
});

describe("Home page", () => {
  it("should render Home page", () => {
    cy.visit("localhost:5173/home");
    cy.get("[data-cy='home-appShell']").should("exist");
  });
});

describe("Advanced Search page ", () => {
  /*
  describe("parameter specificity modifiers", () => {
    it("should render Advanced Search page", () => {
      cy.visit("localhost:5173/home/advancedSearch");
      cy.get("[data-textinput='find-allWords']").should("exist");
    });

    it("should display text when user enters chars in find-allWords input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-allWords']").type("Cordelia's Honor");
      cy.get("[data-textinput='find-allWords']").should("have.value", "Cordelia's Honor");
    });

    it("should display text when user enters chars in find-exactPhrase input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-exactPhrase']").type("Paladin of Souls");
      cy.get("[data-textinput='find-exactPhrase']").should("have.value", "Paladin of Souls");
    });

    it("should display text when user enters chars in find-atLeastOne input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-atLeastOne']").type("Snow Crash");
      cy.get("[data-textinput='find-atLeastOne']").should("have.value", "Snow Crash");
    });

    it("should display text when user enters chars in find-none input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-textinput='find-none']").type("The Uplift War");
      cy.get("[data-textinput='find-none']").should("have.value", "The Uplift War");
    });

    it("should display '10' upon initial render in resultsPerPage input", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-nativeselect='resultsPerPage']").should("have.value", "10");
    });

    //not working well, need to figure out how to select the option
    //contains just confirms that the data array contains the value, not necessarily that the user has selected it and it is displayed
    /*
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
  */
  /*
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
        "Default: does not restrict and returns all books",
      );
    });

    it("should display dropdown with text when user mouse over the 'Epub' radio button", () => {
      cy.visit("localhost:5173/home/advancedSearch");

      cy.get("[data-radioinput='filter-epubFormat']").trigger("mouseover");
      cy.get("[data-radioinput='filter-epubFormat-dropdown']").should(
        "have.text",
        "Only returns results that have an available epub download format",
      );
    });
  });
*/
  /*
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
          "Default: does not restrict and returns all books",
        );
      });

      it("'Partial books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-partialBooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-partialBooks-dropdown']").should(
          "have.text",
          "Returns results where at least part of the text is previewable.",
        );
      });

      it("'Full books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-fullBooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-fullBooks-dropdown']").should(
          "have.text",
          "Only returns results where all of the text is viewable.",
        );
      });

      it("'Free eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-freeEbooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-freeEbooks-dropdown']").should(
          "have.text",
          "Only returns results that are free Google eBooks.",
        );
      });

      it("'Paid eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-paidEbooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-paidEbooks-dropdown']").should(
          "have.text",
          "Only returns results that are Google eBooks with a price.",
        );
      });

      it("'All eBooks' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-allEbooks']").trigger("mouseover");
        cy.get("[data-radioinput='filter-allEbooks-dropdown']").should(
          "have.text",
          `Returns all Google eBooks, both free and paid. Examples of non-eBooks would be publisher content that is available in limited preview and not for sale, or magazines.`,
        );
      });
    });
  });
  */
  /*
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
          "Default: does not restrict and returns all publication types",
        );
      });

      it("'Books' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-books']").trigger("mouseover");
        cy.get("[data-radioinput='filter-books-dropdown']").should(
          "have.text",
          "Returns only results that are books.",
        );
      });

      it("'Magazines' radio button", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-radioinput='filter-magazines']").trigger("mouseover");
        cy.get("[data-radioinput='filter-magazines-dropdown']").should(
          "have.text",
          "Returns only results that are magazines.",
        );
      });
    });
  });
  */

  describe("book volumes general modifiers", () => {
    describe("should have text in ${} inputs", () => {
      it("'title''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='title']").type("A Fire Upon the Deep");
        cy.get("[data-textinput='title']").should("have.value", "A Fire Upon the Deep");
      });

      it("'author''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='author']").type("Vernor Vinge");
        cy.get("[data-textinput='author']").should("have.value", "Vernor Vinge");
      });

      it("'publisher''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='publisher']").type("Tor Books");
        cy.get("[data-textinput='publisher']").should("have.value", "Tor Books");
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
          "Search for books that contain this word or phrase in the title.",
        );
      });

      it("'author''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='author']").trigger("mouseover");
        cy.get("[data-textinput='author-dropdown']").should(
          "have.text",
          "Search for books that contain this word or phrase in the author's name.",
        );
      });

      it("'publisher''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='publisher']").trigger("mouseover");
        cy.get("[data-textinput='publisher-dropdown']").should(
          "have.text",
          "Search for books that contain this word or phrase in the publisher's name.",
        );
      });

      it("'subject'", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='subject']").trigger("mouseover");
        cy.get("[data-textinput='subject-dropdown']").should(
          "have.text",
          `Search for books that contain this word or phrase within a category. Example: 'science-fiction'`,
        );
      });

      it("'isbn''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='isbn']").trigger("mouseover");
        cy.get("[data-textinput='isbn-dropdown']").should(
          "have.text",
          "Search for books that match this ISBN. The International Standard Book Number is a unique product identifier used in the publishing industry to identify the registrant as well as the specific title, edition and format. Example: '978-0671578282'",
        );
      });

      it("'lccn''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='lccn']").trigger("mouseover");
        cy.get("[data-textinput='lccn-dropdown']").should(
          "have.text",
          "Search for books that match this LCCN. A Library of Congress Control Number is assigned to a book while the book is being catalogued by the Library of Congress, if it has been selected for addition to the Library's collections. Example: '96024819'",
        );
      });

      it("'oclc''", () => {
        cy.visit("localhost:5173/home/advancedSearch");

        cy.get("[data-textinput='oclc']").trigger("mouseover");
        cy.get("[data-textinput='oclc-dropdown']").should(
          "have.text",
          "Search for books that match this OCLC number. Online Computer Library Center is a cooperative, computerized network for libraries and provide bibliographic, abstract and full-text information. They also maintain the Dewey Decimal Classification system. Example: '42320675'",
        );
      });
    });
  });
});
