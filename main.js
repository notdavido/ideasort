import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, set, push, update, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfLy16MYJdhVDMBEsLI-OpvvzE_-Pp1WM",
    authDomain: "websitequoteproj.firebaseapp.com",
    projectId: "websitequoteproj",
    storageBucket: "websitequoteproj.appspot.com",
    messagingSenderId: "2692474268",
    appId: "1:2692474268:web:3c80dbd6a1da22738d5459",
    measurementId: "G-D7J1B3EQKV",
    databaseURL: `https://websitequoteproj-default-rtdb.firebaseio.com/`,
  };


  //initialize
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const db = getDatabase();

const auth = getAuth();


function validateemail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
     {
       return true
     }
       alert("You have entered an invalid email address!")
       return false
   }
   
   function validatepassword(password) {
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  

function register(event){
    event.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('emailpassword').value
  
    if (validateemail(email) == false || validatepassword(password) == false) {
      return
    }
    createUserWithEmailAndPassword(auth,email,password)
    
    .then(function() {
      
      var user = auth.currentUser
      // console.log("User:", user); // Check if user object is retrieved correctly
  
      
      // var database_ref = db.ref();
      
      console.log("here")
      var user_data = {
        email : email,
        last_login : Date.now()
      }
  
      set(ref(db, 'users/' + user.uid), user_data)
        .then(() => {
            console.log("User added to database");
            window.location.href = 'landingpage.html';
            // Optionally reset the form here
        })
        .catch((error) => {
          var error_code = error.code
          var error_message = error.message
          //console.error("Error:", error_code, error_message)
         
          
        });
      // database_ref.child('users/' + user.uid).set()
  
    })
    .catch((error) => {
      var error_code = error.code
      var error_message = error.message
      console.log(error_code)
      if (error_code === 'auth/email-already-in-use') {
        // Handle email already in use error here
        alert("account already exists")
        // Display appropriate message to the user
      }
    });
  }
  
  function login() {
    event.preventDefault();
    //get input fields
  
    
  
    const email = document.getElementById('email').value
    const password = document.getElementById('emailpassword').value
    //validate
    if (validateemail(email) == false || validatepassword(password) == false) {
      return
    }
  
    console.log("here")
      var user_data = {
        last_login : Date.now()
      }
      signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User logged in:", user);
      window.location.href = 'landingpage.html';
      // Update user data
      update(ref(db, 'users/' + user.uid), user_data)
        .then(() => {
          console.log("User data updated successfully");
          // Optionally reset the form here
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    })
    .catch((error) => {
      // Handle sign-in errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign-in error:", errorCode, errorMessage);
    });
  }
  


function setCookie(cookieName, cookieValue) {
    document.cookie = cookieName + "=" + cookieValue + ";path=/";
  }
  
  //use Project Set for getting val
  function getCookie(cookieName) { ////might need to reorder depending on what might happen
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
  }
  
document.addEventListener("DOMContentLoaded", function() {
  
    const signinpage = document.getElementById('signuppageredirect');
    const loginpage = document.getElementById('loginpageredirect');
  
    auth.onAuthStateChanged(function(user) {
      
    if (user) {
        if (window.location.href.includes('login.html') || window.location.href.includes('signup.html')) {
            // If the current page is either 'login.html' or 'signup.html', reload the page
            setTimeout(function() {
            // Actions to perform after waiting
            console.log("Actions after waiting");
        }, 2000)};
        // window.location.href = 'landingpage.html';

    if (window.location.href.includes('landingpage.html')) {

        // Retrieve the data once

        const dataRef = ref(db, 'users/' + user.uid + '/ideaprojects');
        const topictemplate = document.getElementById('tobedetermined');
        const topicscontainer = document.getElementById("topics-container");

        const activeProjectsRef = ref(db, 'users/' + user.uid + '/ideaprojects');

        let numChildren = 1;
        get(activeProjectsRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    numChildren++;
                });
                console.log("Number of children under ideaprojects:", numChildren);
            } else {
                console.log("No ideaprojects found for the user.");
            }
        });
        const button22 = document.getElementById("simplesetcreate"); //this is a temporary solution
        button22.addEventListener("click", function() {
        console.log('3ffsf')
        set(ref(db, 'users/' + user.uid + '/ideaprojects/' + numChildren ),numChildren);
        location.reload();
        });
        // function changetopcinformation(instance, iteration) {

        // }

        get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {

            // Data exists at the specified location
            const data = snapshot.val();
            console.log("Data exists:", data);

            let numChildren = 0;
            snapshot.forEach(childSnapshot => {
            
            numChildren++;
            let iteration = numChildren;
            
            // if (numChildren == 1) {


            //   return;
            // }
            console.log("if we want to make real names for the things we would have to check here");

            const clone = topictemplate.cloneNode(true);  
            clone.id = ("topic"+iteration);
            topicscontainer.appendChild(clone); // Append the clone to the topicscontainer

            
            const cloneH3 = clone.querySelector('h3');
            cloneH3.textContent = ('Selection ' + iteration);

            clone.addEventListener("click", function() {
                console.log('click: ' + iteration)
                setCookie('Project Set', iteration); 
                // let newcookie = getCookie('Project Set')
                // console.log(newcookie) //works

                window.location.href = "index.html";
            });
        });
            
        document.getElementById('tobedetermined').remove(); //redefined instead of variable for consistency
        console.log('delete')



            // object.addEventListener("click", myScript);
        } else {
            // Data doesn't exist at the specified location
            alert("create a dataset with the button below");
            // set(ref(db, 'users/' + user.uid + '/activeprojects/' + 1 + '/quotes'));
        }
        }).catch((error) => {
            console.log("Error getting data:", error);
        });



  
  
  
  
  
  
        }
        if (window.location.href.includes('index.html')) {
        // const mockbrowsersetup = document.getElementById("mockupbrowser");
        const boxContainer = document.getElementById("parentbox");
        const mainbox = document.getElementById("mainbox");
        const mainsiblingcontainer = document.getElementById("mainsiblings")

        const parentboxclone = mainbox.cloneNode(true);
        boxContainer.remove();


        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");



        let macookie = getCookie("Project Set"); //cookie for which project
        if (!macookie) {
            alert("Select set to work on");
            window.location.href = "landingpage.html";
        }
        

        window.addEventListener("resize", function() {
            // Code to execute when the window is resized
            redrawAllLines(root);
            // Your code to handle resize event (e.g., update canvas size)
        });
        function redrawAllLines(top){
            if (top == root){
                const body = document.body;
                canvas.width = body.scrollWidth-10;
                canvas.height = body.scrollHeight-10;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } 

            
            // console.log(top.children)
            if (top.children) {
                for (const child of top.children) {
                    // console.log(child)
                    if (child.parentbox != null){
                        redrawAllLines(child);
                        child.createLineToParent()
                    }
                
                }

            }
        }

        function redrawBoxes(top){
            if (top == root){
                const body = document.body;
                canvas.width = body.scrollWidth-10;
                canvas.height = body.scrollHeight-10;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            // console.log(top.children)
            if (top.children) {
                for (const child of top.children) {
                    // console.log(child)
                    if (child.parentbox == null){
                        
                        child.createBoxElement()
                        child.createLineToParent()
                        redrawAllChildNodesWithoutException(child)
                    }
                
                }

            }
        }

        function redrawAllChildNodesWithoutException (top){
            if (top.children) {
                for (const child of top.children) {
                    // console.log(child)

                        
                        child.createBoxElement()
                        child.createLineToParent()
                        redrawAllChildNodesWithoutException(child)
                
                }

            }
        }

        async function firebaseGet(path) {
            try {
                const dataRef = ref(db, path); // Correctly create a reference to the path
                const snapshot = await get(dataRef);
                
                if (snapshot.exists()) {
                    return snapshot.val();
                } else {
                    console.log('No data available at the path.');
                }
            } catch (error) {
                console.error("Error getting data:", error);
            }
        }
        async function firebaseSet(path, data) {
            try {
                const dataRef = ref(db, path); // Correctly create a reference to the path
                await set(dataRef, data); // Set the data at the specified path
                console.log('Data successfully written to the path.');
            } catch (error) {
                console.error("Error setting data:", error);
            }
        }
        function createDivElement(location){
            let sb = document.createElement("div");
            sb.classList.add("flex", "flex-nowrap");
            sb.id = 'mainsiblings'
            location.appendChild(sb);
            return sb
        }
        function setupEventListeners(thisfake) { //thisfake is just the passed 'this'
            thisfake.searchtext.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    thisfake.summarytext.textContent = thisfake.searchtext.value;
                    thisfake.searchtext.value = '';
                }
            });
        
            thisfake.addbutton.addEventListener("click", () => {
                thisfake.createChild();
            });
        
            thisfake.accordian.addEventListener("click", () => {
                setTimeout(() => {
                    redrawAllLines(root);
                }, 150);
            });
        
            thisfake.minimizebutton.addEventListener("click", () => {
                thisfake.removeBoxElement();
            });
        
            thisfake.maximizebutton.addEventListener("click", () => {
                redrawBoxes(thisfake);
                redrawAllLines(root);
            });
        }
        class Node {
            constructor(text) {
                
                this.text = text;
                this.children = [];
                // this.childrenbox = mainbox.cloneNode(true);
                // this.childrenbox.append()
                // const dataRef = ref(db, 'users/' + user.uid + '/ideaprojects/' + macookie + '/head');
                
                // console.log(dataRef)
            }

            createChild(text) {
                const child = new Node(text);
                this.children.push(child);
                child.parent = this;
                child.id = generateUniqueId();
                
                child.instanceDataRef = this.instanceDataRef + "/" + child.id;
                const dataTextPath = child.instanceDataRef + "/datatext";
                const dataTextAreaPath = child.instanceDataRef + "/datatextarea";
-
                firebaseSet(child.instanceDataRef, 'node'); 
                firebaseSet(dataTextPath, 'empty');
                firebaseSet(dataTextAreaPath, 'empty');

                child.createBoxElement();
                return child;
            }
            loadChild(text){
                console.log('ahfh')
            }

            createBoxElement() {
                let newBoxContainer = parentboxclone.cloneNode(true); //mainbox clone
                let find = 0
                if (this != root){
                    find = this.parent.siblingcontainer;
                  }
                  else{
                    find = mainsiblingcontainer
                  }
                find.append(newBoxContainer)

                this.parentbox = newBoxContainer;
                this.searchtext = this.parentbox.querySelector(".place-content-stretch");
                this.summarytext = this.parentbox.querySelector(".collapse-title");
                this.addbutton = this.parentbox.querySelector("#addanotherbox");
                this.mockup = this.parentbox.querySelector(".mockup-browser");
                this.accordian = this.parentbox.querySelector(".bg-base-200");
                this.textarea = this.parentbox.querySelector(".textarea-bordered");
                this.minimizebutton = this.mockup.querySelector("#minimize");
                this.maximizebutton = this.mockup.querySelector("#maximize");
                this.siblingcontainer = createDivElement(newBoxContainer); 

                const dataTextPath = this.instanceDataRef + "/datatext";
                const dataTextAreaPath = this.instanceDataRef + "/datatextarea";

                const updateSummaryText = async (dataTextPath) => { //async function to get function elsewhere for not eyesore
                    const datatext = await firebaseGet(dataTextPath);
                    this.summarytext.textContent = datatext || 'No data available';
                };
                const updateTextArea = async (textpath) => {
                    const datatext = await firebaseGet(textpath);
                    this.textarea.textContent = datatext || 'No data available';
                };

                updateSummaryText(dataTextPath);
                updateTextArea(dataTextAreaPath);

                redrawAllLines(root);

                setupEventListeners(this); //important for buttons
                
                return newBoxContainer;
            }
            
            createLineToParent() {
                if (this.parent == undefined) {
                    console.log('ended')
                return
                }
                let div1 = this.mockup
                let div2 = this.parent.mockup
                if (div2 == undefined || div1 == undefined) {
                    return;  // Handle case where divs are not available
                }
                // console.log(div1,div2)
                var pointA = {
                    x: div1.offsetLeft + div1.offsetWidth / 2,
                    y: div1.offsetTop + div1.offsetHeight / 2
                };
                var pointB = {
                    x: div2.offsetLeft + div2.offsetWidth / 2,
                    y: div2.offsetTop + div2.offsetHeight / 2
                };
                
                
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 2;
                // console.log(pointA, pointB)
                // Begin a new path
                ctx.beginPath();
                ctx.moveTo(pointA.x, pointA.y);
                ctx.lineTo(pointB.x, pointB.y);
                ctx.stroke();
                // console.log('drawed')
            }
            removeBoxElement() {
                if (this.id != root.id){
                    // console.log(this.id, root.id)
                    // console.log("sadhufioahsdfoiuashf")
                    this.parentbox.remove()
                    this.siblingcontainer.remove()
                    this.parentbox = null;
                    redrawAllLines(root);
                }
            }
        }
        document.addEventListener("mouseup", () => {
            redrawAllLines(root);
        });
        let idCounter = 0;
        function generateUniqueId() {
            const timestamp = Date.now().toString(36).substring(2, 7);
            const sequencePart = ('0000' + idCounter++).slice(-5); // 5-digit sequence
            return timestamp + sequencePart;
        }



        const projectname = 'header';
    let pathToProject = ('users/' + user.uid + '/ideaprojects/' + macookie + "/" + projectname);
    const projectRef = ref(db, pathToProject);
    const root = new Node();

    function initializeRoot() {
        root.parentbox = mainbox;
        root.siblingcontainer = mainsiblingcontainer;
        root.createBoxElement();
    }

    get(projectRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.hasChildren()) {
                    const firstChildKey = Object.keys(snapshot.val())[0];
                    console.log(firstChildKey);
                    const childRef = ref(db, `${pathToProject}/${firstChildKey}`);
                    console.log("Project '" + projectname + "' has children. Setting root.dataRef to the first child.");
                    
                    root.instanceDataRef = `${pathToProject}/${firstChildKey}`;
                    console.log(root.instanceDataRef);
                    initializeRoot();
                } else {
                    let newID = generateUniqueId();
                    console.log("Project '" + projectname + "' exists but has no children.");

                    const newChildPath = `${pathToProject}/${newID}`;
                    const newChildRef = ref(db, newChildPath);

                    set(newChildRef, 'node').then(() => {
                        root.id = newID;
                        root.instanceDataRef = newChildPath;
                        console.log("Temporary child created and root.dataRef set to it.");
                        initializeRoot();
                    }).catch((error) => {
                        console.error("Error setting new child:", error);
                    });
                }
            } else {
                let newID = generateUniqueId();
                set(projectRef, 1).then(() => {
                    console.log("Project '" + projectname + "' created.");

                    const newChildPath = `${pathToProject}/${newID}`;
                    const newChildRef = ref(db, newChildPath);
                    root.instanceDataRef = newChildPath;
                    const dataTextPath = `${newChildPath}/datatext`;
                    console.log('Data text path:', dataTextPath);
                    const dataTextAreaPath = newChildPath + "/datatextarea";
                    const dataTextAreaRef = ref(db, dataTextAreaPath);
                    
                    

                    const dataTextRef = ref(db, dataTextPath);
                    console.log('Data text ref:', dataTextRef);

                    set(newChildRef, 'node').then(() => {
                        root.id = newID;
                        root.instanceDataRef = newChildPath;
                        console.log("Temporary child created and root.dataRef set to it.");
                        set(dataTextAreaRef, 'empty')
                            .then(() => {
                                console.log('Data text set successfully.');
                            })
                            .catch((error) => {
                                console.error("Error setting data text:", error);
                            });
                        set(dataTextRef, 'empty')
                            .then(() => {
                                console.log('Data text set successfully.');
                                get(dataTextRef).then((snapshot) => {
                                    if (snapshot.exists()) {
                                        console.log('Data in Firebase:', snapshot.val());
                                    } else {
                                        console.log('No data found at the path.');
                                    }
                                    initializeRoot();
                                }).catch((error) => {
                                    console.error("Error fetching data:", error);
                                    initializeRoot();
                                });
                            })
                            .catch((error) => {
                                console.error("Error setting data text:", error);
                                initializeRoot();
                            });
                    }).catch((error) => {
                        console.error("Error setting new child:", error);
                    });
                }).catch((error) => {
                    console.error("Error creating project:", error);
                });
            }
        })
        .catch((error) => {
            console.error("Error checking project:", error);
        });

    

            }
        if (signinpage) {
            signinpage.remove();
        }
        loginpage.textContent = "Log Out";

        loginpage.addEventListener('click', function() { //loginpage is actually logout for now
        // Sign out the current user
            auth.signOut().then(() => {
                // Sign-out successful.
                console.log('User signed out');
                // Reload the page
                window.location.reload();
            }).catch((error) => {
                // An error happened.
                console.error('Sign out error:', error);
            });
        });
        } else {
        // User is signed out.
            console.log("User is signed out");
            if (window.location.href.includes('landingpage.html')) {
                alert('you must sign in to use this feature');
            }
        // Your code for signed out user here
        }
    });

    if (document.getElementById('onregisterclick')) {
    // console.log("check")
    const registerelement = document.getElementById('onregisterclick');
    const formelement = document.getElementById('formtosignup');

    registerelement.addEventListener('click', register);  // Pass the function itself
    } else {
    // console.log("register element not found on this page.");
    }

    if (document.getElementById('onloginclick')) {
        // console.log("check")
        const loginelement = document.getElementById('onloginclick');
        loginelement.addEventListener('click', login);

    } else {
    // console.log("login element not found on this page.");
    }


// Other DOM-related operations...
});
  
  // Other JavaScript code that doesn't depend on DOM content can go here
  // This code will execute immediately without waiting for the DOM to be fully loaded
  
  
