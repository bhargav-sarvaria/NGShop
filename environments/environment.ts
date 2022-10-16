// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api/v1/',
    firebaseConfig : {
        apiKey: "AIzaSyC9klyQhiOxshJIZxeA_ztrNQq2stH9YaA",
        authDomain: "shreeshakti-eshop.firebaseapp.com",
        projectId: "shreeshakti-eshop",
        storageBucket: "shreeshakti-eshop.appspot.com",
        messagingSenderId: "355788348738",
        appId: "1:355788348738:web:0dbed8dc43ce7abdec3cdb",
        measurementId: "G-VFZVGNDFZ3"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
