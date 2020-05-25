// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
  firebase: {
    apiKey: 'AIzaSyD0anQh6Bw8EamO1iF0ZEM_VGjJtNe8Efg',
    authDomain: 'gostore-b24ab.firebaseapp.com',
    databaseURL: 'https://gostore-b24ab.firebaseio.com',
    projectId: 'gostore-b24ab',
    storageBucket: 'gostore-b24ab.appspot.com',
    messagingSenderId: '40526662731',
    appId: '1:40526662731:web:dc4ad27179041229f2d1ce',
    measurementId: 'G-W3N0DK4YE3'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
