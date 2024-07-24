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
  

async function register(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('emailpassword').value;

    if (!validateemail(email) || !validatepassword(password)) {
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
            email: email,
            last_login: Date.now()
        };
        await firebaseSet(`users/${user.uid}`, userData);
        console.log("User added to database");
        window.location.href = 'landingpage.html';
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            alert("Account already exists");
        } else {
            console.error("Error registering user:", error);
        }
    }
}
  
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('emailpassword').value;

    if (!validateemail(email) || !validatepassword(password)) {
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
            last_login: Date.now()
        };
        await update(ref(db, `users/${user.uid}`), userData);
        console.log("User data updated successfully");
        window.location.href = 'landingpage.html';
    } catch (error) {
        console.error("Sign-in error:", error);
    }
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
        get(dataRef).then((snapshot) => {
            if (snapshot.exists()) {
                // Data exists at the specified location
                const data = snapshot.val();
                console.log("Data exists:", data);

                let numChildren = 0;
                snapshot.forEach(childSnapshot => {
                
                numChildren++;
                let iteration = numChildren;                
                console.log("if we want to make real names for the things we would have to check here");

                const clone = topictemplate.cloneNode(true);  
                clone.id = ("topic"+iteration);
                topicscontainer.appendChild(clone); // Append the clone to the topicscontainer

                const cloneH3 = clone.querySelector('h3');
                cloneH3.textContent = ('Selection ' + iteration);

                clone.addEventListener("click", function() {
                    console.log('click: ' + iteration)
                    setCookie('Project Set', iteration); 

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
        const mainbox = document.getElementById("mainbox");
        const mainsiblingcontainer = document.getElementById("mainsiblings")
        const parentboxclone = mainbox.cloneNode(true);
        document.getElementById("parentbox").remove(); //remove after to clone child part

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
        });
        function redrawAllLines(top){
            if (top == root){
                const body = document.body;
                canvas.width = body.scrollWidth-10;
                canvas.height = body.scrollHeight-10;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } 
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
            if (top.children) {
                for (const child of top.children) {
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
                        
                    child.createBoxElement()
                    child.createLineToParent()
                    redrawAllChildNodesWithoutException(child)
                }

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
            constructor() {     
                this.children = [];
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
        async function checkAndInitializeProject(projectRef, pathToProject, projectname) {
            try {
                const snapshot = await get(projectRef);
                
                if (snapshot.exists()) {
                    if (snapshot.hasChildren()) {
                        const firstChildKey = Object.keys(snapshot.val())[0];
                        console.log(firstChildKey);
                        const childRef = ref(db, `${pathToProject}/${firstChildKey}`);
                        console.log(`Project '${projectname}' has children. Setting root.dataRef to the first child.`);
                        
                        root.instanceDataRef = `${pathToProject}/${firstChildKey}`;
                        console.log(root.instanceDataRef);
                        initializeRoot();
                    } else {
                        await createTemporaryChild(pathToProject, projectname);
                    }
                } else {
                    await createNewProject(projectRef, pathToProject, projectname);
                }
            } catch (error) {
                console.error("Error checking project:", error);
            }
        }
        async function createTemporaryChild(pathToProject, projectname) {
            try {
                let newID = generateUniqueId();
                console.log(`Project '${projectname}' exists but has no children.`);
                
                const newChildPath = `${pathToProject}/${newID}`;
                await firebaseSet(newChildPath, 'node');
                
                root.id = newID;
                root.instanceDataRef = newChildPath;
                console.log("Temporary child created and root.dataRef set to it.");
                initializeRoot();
            } catch (error) {
                console.error("Error setting new child:", error);
            }
        }
        async function createNewProject(projectRef, pathToProject, projectname) {
            try {
                let newID = generateUniqueId();
                await firebaseSet(pathToProject, 'node');
                console.log(`Project '${projectname}' created.`);
                
                const newChildPath = `${pathToProject}/${newID}`;
                root.instanceDataRef = newChildPath;
                
                await firebaseSet(newChildPath, 'node');
                await firebaseSet(`${newChildPath}/datatext`, 'empty');
                await firebaseSet(`${newChildPath}/datatextarea`, 'empty');
                
                root.id = newID;
                console.log("Temporary child created and root.dataRef set to it.");
                initializeRoot();
            } catch (error) {
                console.error("Error creating project:", error);
            }
        }
        checkAndInitializeProject(projectRef, pathToProject, projectname);
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
            console.log("User is signed out");
            if (window.location.href.includes('landingpage.html')) {
                alert('you must sign in to use this feature');
            }
        }
    });
    if (document.getElementById('onregisterclick')) {
        const registerelement = document.getElementById('onregisterclick');
        registerelement.addEventListener('click', register);  // Pass the function itself
    }
    if (document.getElementById('onloginclick')) {
        // console.log("check")
        const loginelement = document.getElementById('onloginclick');
        loginelement.addEventListener('click', login);
    } 
});
