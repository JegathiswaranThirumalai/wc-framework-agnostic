# Web-Components Framework-Agnostic

For simplicity, we keep all projects in the same folder, but each folder is a different project and does not depend on the others. Here, we are creating the UI library SDK as a local npm package and using it locally instead of publishing it.

## Folder structure
  |      Folder       | Description                       |
  |-------------------|-----------------------------------|
  | web-component-sdk | For generating the UI library     |      
  | container         | **React** application using the SDk   |
  | documents         | **Angular** application using the SDK |
  | cases             | **Plain JS** application using the SDK      |

## Prerequisties
  - Node.js Latest
  - npm

## Web Component SDK
  - Go to "web-component-sdk" folder and run `npm install to install the depedencies
  - To generate the build file run `npm run build`
  - Map the build file as npm package locally using `npm link`

## Container - React Application
  - Go the "container" folder and run `npm install` to install the depedencies
  - Run `npm link wz-sdk` to map the SDK package locally
  - To start the project, run `npm start`

## Documents - Angular Application
  - Go the "documents" folder and run `npm install` to install the depedencies
  - Run `npm link wz-sdk` to map the SDK package locally
  - To start the project, run `ng serve`

## Vannila App - Plain JS Application
  - Go the "vannila-app" folder and run `npm install` to install the depedencies
  - Run `npm link wz-sdk` to map the SDK package locally
  - To start the project, run `npm run dev`
