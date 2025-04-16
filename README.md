# What is this repository?

This repository is a vibe coding experimentation.

The goal is to see if the Spequoia format for software specification can be used to guide a LLM into implementing the software and corresponding automatic tests.

I started by creating a specification file ([`spequoia.yaml`](spequoia.yaml)) and asked Windsurf Cascade to implement the application.

The experimentation gave pretty good results. I didn't have to edit a single line of code. I just tweaked the specification a bit to get the desired results, or fix some bugs.

The trickiest part was implementing Jest tests. The AI wasn't able to make the tests pass because of test infrastructure issues. I switched to Playwright E2E testing and from there it went smoothly.

There are still small inconsistencies: the README still references Jest, the styling is quite ugly, there are example Playwright tests left...

Windsurf version: 1.6.3
Model: Claude 3.5 Sonnet

### Prompt history

> @spequoia.yaml Here is my app description. Setup project and implement feature FEAT-001

> Add a gitignore for node_modules and IDE specific files

> For each feature, there is a list of examples. Implement tests for each example, starting with FEAT-001.

> The test runs and is successful. However, the tested HTML is initialized in the test file. What I want, is the tests to run against the actual app (index.html).

> This test file seems unused. @tests.js Can you cleanup unused files and update spequoia.yaml (@spequoia.yaml ) to reflect the actual project structure?

> Now implement next feature (FEAT-002) with the corresponding tests

> go on

> go on

> @spequoia.yamlE2E testing with Playwright would be more appropriate for testing. Remove Jest dependency, config and tests and replace them with Playwright.

> I detected a bug while testing and added the test "EX-005b" to reproduce it. Add the test and fix the bug.

> I'd like to mark tasks as done by clicking the task name area instead of just the checkbox. Update the spec files to reflect this change and implement the corresponding code and test.

> Proceed with FEAT-009

> Review the code and clean it up if needed

> The UI is broken, style has gone.

> I'd like to change the style. It is quite boring for now. I'd like a more original look and feel with bold articitic choices and distinctive colors.

### Final result

![04](https://github.com/user-attachments/assets/cf4d7376-c5eb-4616-a018-e979dff7372d)

### Progress screen captures

![Cascade01](https://github.com/user-attachments/assets/17d652c0-f3a3-4b32-829e-bbc2eb9eb72d)

![Cascade02](https://github.com/user-attachments/assets/44bfdb0f-4f65-478d-a64c-6eba78a0a0c4)

![01](https://github.com/user-attachments/assets/46b430b6-1275-43b9-a808-3e92467b3868)

![02](https://github.com/user-attachments/assets/80b612a2-3cf2-44eb-b95b-7cb041d7da79)

![Cascade05](https://github.com/user-attachments/assets/891fc7fe-b47e-4636-97df-28d4fe5d3f49)

Following is the generated README file.

___

# Spequoia TODO App

A minimalistic TODO application built with vanilla JavaScript.

## Features

- Create, read, update, and delete tasks
- Persistent storage using browser's localStorage
- Clean and modern UI
- Task completion tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. To run tests:
```bash
npm test
```

3. Open `index.html` in your browser to use the application.

## Technologies

- HTML
- CSS
- JavaScript
- Jest (for testing)
