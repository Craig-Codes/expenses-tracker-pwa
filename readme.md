# Expenses Tracker App

## About

This project aims to allow users to track their business expenses. Users are able to create a new trip, and add images of their recepts to the trip. The image will include a timestamp and a value. The value field allows users to only record how much they need to claim back, and ignore orther expenses which may not be covered under business rates such as alcohol.

Users are able to create, read, update and delete both trips and receipts. A running total, and total per trip is visible so that users can quickly see how much the trip is costing, and the total balance they need to claim back from HR.

## Technologies

This App is build using the Ionic and Angular frameworks. By combining these technologies, the app can be published as a Progressive Web App (PWA), so it can be used on the web (here's the live link: https://expenses-tracker-app-8c5e9.web.app), as well as being used as a native app on both Android and iOS devices. I used this project to further develop my understanding of Angular and it's core features, and to learn Ionic 5, with this being my first Ionic App. The ability to build once in JavaScript / TypeScript and deploy anywhere really shows the power of Ionic, where apps don't need to be built natively for each environment.

The backend of this application is a simple Node.js API for RESTful Routing, currently hosted on Heroku's free tier. This does mean if the app hasnt been used in some time there will be a delay on the first request to the server, as it needs to wake up.
The Node.js API communicates securely with a MongoDB Cloud Atlas instance to store, edit and manipulate user data. MongoDB proved to be a good database choice for this use case, as the schema is pretty basic, the free tier gives generous data limits and it can be easily scaled if necessary.

I wanted to try out social login, as an alernative way to save time for users. This way a user can quickly authenticate and login to the app without having to create a seperate user account and remember yet another password. I used Firebase for this, as a nice way to control user logins, and deal with the storage of user access tokens and securly store passwords etc.

The web version of this app if currently hosted on Firebase.

## Frontend Setup

To run this project locally, fork this repository and navigate to the 'Frontend' directory:

```
$npm install
$ionic serve
```

Note: authentication will not work, as firebase auth has been locked down to stop local logins, only accepting login from the correctly hosted domain. To see the working app in action - https://expenses-tracker-app-8c5e9.web.app. To get your own local version working, just swap out the firebase details in the 'environments' directory with your firebase project and authentication details.

This project is easily converted into a native Android application. After making any changes simply follow these commands:

```
$ionic build --prod
$npx cap copy android
$npx cap open android
```

The app will now open up in android studio, where it can be tried on an emulator, or on your own android device.

## Backend API Setup

To run this project locally, fork this repository and navigate to the 'Backend' directory:

```
$npm install
$node server.js
```

Note: you will have no access to the live MongoDB instance, as the URL is a protected environmental varaible only exposed to the Heroku hosting platform. To see the app in action, please view the live workign version (https://expenses-tracker-app-8c5e9.web.app). Alternatively you can create a new MongoDB instance and add the url to line 26.
