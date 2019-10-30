import * as firebase from "firebase";
import store from '@/store/userStore';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_Api_Key,
  authDomain: process.env.VUE_APP_AuthDomain,
  databaseURL: process.env.VUE_APP_DatabaseURL,
  projectId: process.env.VUE_APP_ProjectId,
  storageBucket: process.env.VUE_APP_StorageBucket,
  messagingSenderId: process.env.VUE_APP_MessagingSenderId,
  appId: process.env.VUE_APP_AppId,
  measurementId: process.env.VUE_APP_MeasurementId
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(user => {
  console.log(user)
  store.dispatch("fetchUser", user);
});