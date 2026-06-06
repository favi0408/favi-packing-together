import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAfZzxKGu3jiVGvXwHxyED5yb8kgouQ60g',
  authDomain: 'favi-packing-together.firebaseapp.com',
  projectId: 'favi-packing-together',
  storageBucket: 'favi-packing-together.firebasestorage.app',
  messagingSenderId: '697512032165',
  appId: '1:697512032165:web:16248c331d102b1fd21a4c',
  measurementId: 'G-RLYZ0B91RE',
};

export const app = initializeApp(firebaseConfig);
export default app;