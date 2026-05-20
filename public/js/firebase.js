
// import { initializeApp }

// from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// import { getAuth }

// from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
    getAuth,
    GoogleAuthProvider
} 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const firebaseConfig = {
    
    
    // apiKey: "AIzaSyAPf9xnCv134LJLi7vKFgp5dy30cI_fXPk",
    // authDomain: "iust-lost-and-found.firebaseapp.com",
    // projectId: "iust-lost-and-found",


    apiKey: "AIzaSyAPf9xnCv134LJLi7vKFgp5dy30cI_fXPk",
  authDomain: "iust-lost-and-found.firebaseapp.com",
  projectId: "iust-lost-and-found",
  storageBucket: "iust-lost-and-found.firebasestorage.app",
  messagingSenderId: "86598040082",
  appId: "1:86598040082:web:c050a097697b3611ea36cb",
  measurementId: "G-6NST393E21"
 

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();