# Byblos

Byblos is a free web app that allows you to explore an endless world of literature, all stored in one convenient location. Dive into a treasure trove of millions of books from all corners of the globe, at your fingertips and ready to be discovered.

With Byblos, you can search and preview any book before making a commitment. Once finished, rate and favorite your most beloved reads and organize them in your personal bookshelf. Never lose track of your favorites again and easily access them whenever you need them.

### Project Goals

This project was initially started as a remake of the author's Odin Project's Library app. Partway through the project, they decided to expand the scope, partly to improve upon the native Google Books user experience, and partly to familiarize themselves with the API and with the new Mantine component library.

### Usage

The main search input is a generic keyword search that will return all matches. The advanced search page provides a plethora of options to further refine the results to the user's preference.

Once a volume is chosen, the user can view a short description, and clicking on the title takes them to an Overview page which provides further details, including links to popular stores (Amazon, Chapters-Indigo, Google Books), and previews using Google Web Reader if available. They can also view other editions of the volume, author's and publisher's collections relating to selected volume.

Any volume can be favorited, rated, selected to read later and marked as read. Doing so will store the volume in the user's own personal bookshelf where they can filter according to aforementioned actions.

### Todo

This app is a work in progress and is still in beta. At present, the app does not fullfill all of the author's stated goals. It falls short of providing all of the Google Books native functionality. However, it mimics closely the core functionality.

Future updates planned may include:

- Location based public library integration to allow renting books
- Ability to view epubs, pdfs through the app
- Information from other API's - Open Library, etc.
- Backend with user login, authorization to access app on any device
- Write and share reviews, favorites and perhaps a forum

### Contributions

Thank you for your interest in contributing to my app! Here's a brief guide on how to get started:

#### Setting up a Development Environment

1. Install Git: Git is a version control system that allows you to contribute code to the app. You can download it from https://git-scm.com/downloads
2. Fork the app's repository: Click on the "Fork" button on the top-right corner of the repository page to create a copy of the repository in your GitHub account.
3. Clone the forked repository: In your terminal, navigate to the directory where you want to store the app's code and run the following command:

```
git clone https://github.com/Athma-Vasi/Byblos.git
```

4. Install dependencies:

```
npm install
```

#### Running Tests

Before submitting code changes, you should run the app's test suite to ensure that your changes don't break existing functionality. Here's how you can run the tests:

1. Navigate to the app's directory.
2. Run the following command to install testing dependencies:

```
npm install --dev
```

3. Run the tests:

```
npm test
```

#### Submitting Pull Requests

Once you've made changes to the code and confirmed that the tests pass, you can submit a pull request (PR) to merge your changes into the app's main codebase. Here's how you can submit a PR:

1. Commit your changes: Make sure to write clear commit messages that describe the changes you made.

```
git add .
git commit -m "Your commit message here"
```

2. Push your changes to your forked repository:

```
git push origin branch-name
```

3. Create a pull request: Go to the original repository's page and click on the "New pull request" button. Select your forked repository and the branch you made changes on, and then create the pull request.

#### Code Formatting and Style Guidelines

To maintain consistency in the codebase, we follow certain code formatting and style guidelines.

- Use 2 spaces for indentation
- Use camelCase for variable and function names.
- Use single quotes for string literals.
- Place opening braces on the same line as the function declaration.

That's it! I hope this guide helps you get started with contributing to my app. If you have any further questions or need help with anything, feel free to ask!

### License

Copyright © 2023 Athma Vasi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```

```

```

```
