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
                child.createBoxElement();
        
                const db = getDatabase();
                console.log(child.parent.instanceDataRef)
                const childPath = this.instanceDataRef + "/" + child.id;
                console.log("Attempting to set child reference at path:", childPath);

                const childRef = ref(db, childPath);
        
                set(childRef, 'data')
                    .then(() => {
                        child.instanceDataRef = childRef;
                        console.log("Child instance data reference set successfully.");
                    })
                    .catch((error) => {
                        console.error("Error setting child instance data reference:", error);
                    });
        
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
                // this.searchtext.placeholder = this.parent.text;
                // this.summarytext.textContent = this.text;

                let sb = document.createElement("div");
                sb.classList.add("flex", "flex-nowrap");
                sb.id = 'mainsiblings'
                newBoxContainer.appendChild(sb);
                this.siblingcontainer = sb
                // if (parentTextElements) {
                //     console.log(parentTextElements)
                    
                // } else {
                //   console.log("Element not found");
                // }
                // this.createLineToParent()
                redrawAllLines(root);
                this.searchtext.addEventListener("keydown", (event) => {
                    // Check if Enter key is pressed
                    if (event.key === "Enter") {
                    this.summarytext.textContent = this.searchtext.value;
                    this.searchtext.value = '';
                    }
                });
                this.addbutton.addEventListener("click", () => {
                    // Code to be executed when the button is clicked
                    this.createChild()
                });
                
                this.accordian.addEventListener("click", () => {
                    setTimeout(() => {
                    redrawAllLines(root);
                    }, 150); // Wait 1 second (1000 milliseconds)
                });
                
                this.minimizebutton.addEventListener("click", () => {
                    // Code to be executed when the button is clicked
                    this.removeBoxElement()
                    // console.log('minimize box')
                });

                this.maximizebutton.addEventListener("click", () => {
                    // Code to be executed when the button is clicked
                    redrawBoxes(this);
                    redrawAllLines(root);
                });
                
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
        let pathToProject = ('users/' + user.uid + '/ideaprojects/' + macookie + "/" + projectname)
        const projectRef = ref(db, pathToProject);
        // let childDataRef = 0
        const root = new Node();

        get(projectRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.hasChildren()) {
                        // Assuming there is only one child, get the first child key
                        const firstChildKey = snapshot.val()[Object.keys(snapshot.val())[0]];
                        console.log(firstChildKey)
                        const childRef = ref(db, pathToProject + "/" + firstChildKey);
                        console.log("Project '" + projectname + "' has children. Setting root.dataRef to the first child.");
                        root.instanceDataRef = (pathToProject + "/" + firstChildKey);
                        // console.log(childDataRef)
                    } else {
                        console.log("Project '" + projectname + "' exists but has no children.");
                        childDataRef = ref(db, pathToProject + "/temporary");
                        set(childDataRef, 'data').then(() => {
                            root.instanceDataRef = (pathToProject + '/temporary');
                            console.log("Temporary child created and root.dataRef set to it.");
                        });
                    }
                } else {
                    // Project doesn't exist, proceed to set the value
                    return set(projectRef, 1).then(() => {
                        console.log("Project '" + projectname + "' created.");
                        root.instanceDataRef = projectRef; //this is wrong but we will proceed (do i even come back to these issues?)
                    });
                }
            })
            .catch((error) => {
                console.error("Error checking project:", error);
            });

        
        // root.instanceDataRef = childDataRef
        root.parentbox = mainbox;
        root.siblingcontainer = mainsiblingcontainer;

        // root.createChild('1')
        root.createBoxElement()
        // console.log(this.instanceDataRef)



        
        // const forname = ref(db, 'users/' + user.uid + '/ideaprojects/' + macookie + '/name');


        // const dataRef = ref(db, 'users/' + user.uid + '/ideaprojects/' + macookie + '/head');

        // get(dataRef).then((snapshot) => {
        // // console.log(dataRef);
        // if (snapshot.exists()) {

        //     let indexedQuotes = createquoteboxes(snapshot);
            
        //     document.getElementById("quotetobedetermined").remove();
        //     // console.log(indexedQuotes); // This will log the indexed quotes object
        // }
        // });

        // get(forname) //idk that this does anything rn??
        // .then((snapshot) => {
        // if (snapshot.exists()) {
        //     // Node exists in the database
        //     const nameValue = snapshot.val(); //gives the crzy identifier
        //     console.log("Name:", nameValue);

        //     let projitem = document.getElementById("myButton");
        //     projitem.textContent = nameValue;
        // } else {
        //     // Node doesn't exist in the database
        //     console.log("Name node does not exist in the database.");
        // }
        // })
        // .catch((error) => {
        //     console.error("Error getting name from the database:", error);
        // });
    

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
  
  
