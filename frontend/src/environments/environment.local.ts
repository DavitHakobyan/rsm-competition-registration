export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: "demo-project-key",
    authDomain: "localhost",
    projectId: "competition-registration-e8597",
    storageBucket: "competition-registration-e8597.firebasestorage.app",
    messagingSenderId: "604730050659",
    appId: "1:604730050659:web:1e8acb7463f7fcae5f9056"
  },
  emulators: {
    auth: {
      host: 'localhost',
      port: 9099
    },
    firestore: {
      host: 'localhost',
      port: 8080
    }
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