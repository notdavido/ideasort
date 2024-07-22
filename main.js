const mockbrowsersetup = document.getElementById("mockupbrowser");
const boxContainer = document.getElementById("parentbox");
const mainbox = document.getElementById("mainbox");
const mainsiblingcontainer = document.getElementById("mainsiblings")

const parentboxclone = mainbox.cloneNode(true);
boxContainer.remove();


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

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
        this.id = generateUniqueId();
        this.text = text;
        this.children = [];
        // this.childrenbox = mainbox.cloneNode(true);
        // this.childrenbox.append()
    }

    createChild(text) {
        const child = new Node(text);
        this.children.push(child);
        child.parent = this;
        child.createBoxElement()


        
        return child;
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
            console.log('minimize box')
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
            console.log(this.id, root.id)
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

const root = new Node("main");
// root.instance = mockbrowsersetup;
root.parentbox = mainbox;
root.siblingcontainer = mainsiblingcontainer

// root.createChild('1')
root.createBoxElement()







// var ctx = canvas.getContext("2d");
// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(200, 200);
// ctx.stroke();

// console.log(root);

// branch: {
//     prop3: 'second',
//     prop4: 'third'
// }

// var pointA = {x: 50, y: 0};
// var pointB = {x: 200, y: 150};

// // Set the line style (optional)
// ctx.strokeStyle = "blue";
// ctx.lineWidth = 2;

// Begin a new path


