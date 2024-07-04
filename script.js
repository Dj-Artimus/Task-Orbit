// Variable to Set the serial count to 0
let srNoCount = 1;
const date = new Date();


function toDoList(priority=undefined){
    let toDoList = [];
    const toDoListDone = [];

    for (let i = 0 ; i < localStorage.length ; i++ ){
        let toDoId = localStorage.key(i);
        if (toDoId.startsWith("d_")){
            toDoListDone.push(toDoId);
        }
        else{
            toDoList.push(toDoId);
        }
    }

    toDoList.sort();
    toDoList.reverse();
    document.getElementById("t").innerHTML= toDoList.length;

    toDoList = priority==undefined? toDoList:priority;

    for (let id of toDoList){
        let toDoDetails = localStorage.getItem(id);
            toDoDetails = toDoDetails.split(",");
            let toDo = toDoDetails[0];
            let desc = toDoDetails[1];
            let type = toDoDetails[2];
            createToDo(id,toDo,desc,type);
    }
    for (let id of toDoListDone){
        let check = localStorage.getItem(id);
        createDone(id,check);
    }
}

// function to add toDo
function add(){
    // Get the input values of to-dos from the user and stored in the variables.
    const toDoId = String(date.getTime());
    const toDo = document.getElementById("toDo").value;
    const desc = document.getElementById("desc").value;
    const type = priority();

    // Save the inputs in local storage received from the user to access it even after refresh or end session or close tab.
    // By using local storage we can access the data until we delete by manually.
    // check for empty toDos and avoid them to save
    if (toDo && (toDo || desc)){

        localStorage.setItem(toDoId,[toDo,desc,type]);
        
        document.getElementById("toDo").value="";
        document.getElementById("desc").value="";
        document.getElementById("toDoWarn").innerHTML="";
        location.reload(true);
        // createToDo(toDoId,toDo,desc,type);
    }
    else{
        document.getElementById("toDoWarn").innerHTML="Please fill out both fields Title and Description(optional)";
    }
}

function priority(){
    if (document.getElementById("imp").checked){
        return "imp";
    }
    else if (document.getElementById("gen").checked){
        return "gen";
    }
    else { return "norm"; }
}

// function to create toDo
function createToDo(toDoId,toDo,desc,type){
    
    const toDoList = document.getElementById("toDo_list");
    // create toDo element in toDo list (div element)
    const toDoElement = document.createElement("div");
    const divId = "srNo_" + toDoId;
    toDoElement.setAttribute("id",divId);
    toDoElement.setAttribute("class","toDoElement");
    toDoElement.setAttribute("class", type);
    toDoList.appendChild(toDoElement);

    // create serial no. element of toDo
    const toDoElementSrNo = document.createElement("h3");
    toDoElementSrNo.setAttribute("class","srNos");
    const toDoElementSrNoText = document.createTextNode(srNoCount);
    toDoElementSrNo.appendChild(toDoElementSrNoText);
    toDoElement.appendChild(toDoElementSrNo);

    // create title element of toDo
    const toDoElementTitle = document.createElement("h3");
    toDoElementTitle.setAttribute("class","title");
    const toDoElementTitleText = document.createTextNode(toDo);
    toDoElementTitle.appendChild(toDoElementTitleText);
    toDoElement.appendChild(toDoElementTitle);
    
    // create description element of toDo
    const toDoElementDescription = document.createElement("p");
    toDoElementDescription.setAttribute("class","description");
    const toDoElementDescriptionText = document.createTextNode(desc);
    toDoElementDescription.appendChild(toDoElementDescriptionText);
    toDoElement.appendChild(toDoElementDescription);
    
    // checkbox to mark down done or undone to do
    const toDoElementDone = document.createElement("input");
    const doneID = "d_" + toDoId;
    toDoElementDone.setAttribute("type","checkbox");
    toDoElementDone.setAttribute("id", doneID);
    toDoElementDone.setAttribute("class","done");
    toDoElementDone.setAttribute("onclick","done(this.id)");
    toDoElement.appendChild(toDoElementDone);
    
    // label for checkbox
    const toDoElementDoneLabel = document.createElement("label");
    toDoElementDoneLabel.setAttribute("for", doneID);
    toDoElementDoneLabel.setAttribute("class","doneLabel");
    const toDoElementDoneLabelText = document.createTextNode("Mark as Done");
    toDoElementDoneLabel.appendChild(toDoElementDoneLabelText);
    toDoElement.appendChild(toDoElementDoneLabel);

    // del button to delete to do
    const toDoElementDel = document.createElement("button");
    toDoElementDel.setAttribute("id",toDoId);
    toDoElementDel.setAttribute("class","del");
    toDoElementDel.setAttribute("onclick","del(this.id)");
    const toDoElementDelText = document.createTextNode("Delete");
    toDoElementDel.appendChild(toDoElementDelText);
    toDoElement.appendChild(toDoElementDel);
    
    srNoCount++;//increase SrNo counter
}

// function to del to do
function del(toDo){
    document.getElementById(("srNo_"+toDo)).style.display = "none";
    localStorage.removeItem(toDo);
    localStorage.removeItem(("d_"+toDo));
    location.reload(true);
}

// funtion to del all to dos
function delAll (){
    localStorage.clear();
    location.reload(true);
}
// funtion to create mark down done or undone and change the appearance of to do element
function createDone(id,check){
    let checkId = document.getElementById(id);
    checkId.checked = check;
    let elementId = checkId.parentElement.id;
    let element = document.getElementById(elementId);
    let title = desc = element.children;

    if (check){
        title[1].style.opacity = "0.5";
        desc[2].style.opacity = "0.5";
    }
    else{
        title[1].style.opacity = "1";
        desc[2].style.opacity = "1";
    }
}

// function to trigger mark done or undone and add to local storage
function done(id){
    let check = document.getElementById(id).checked;
    if(check){
        localStorage.setItem(id,check);
    }
    else{
        localStorage.removeItem(id);
    }
    createDone(id,check);    
}


function prioritySort(evt){
    if(evt.target.value==="Priorities"){

        // let Priority = document.getElementById("prioritySort").children;
        // let setPriority = Priority[1];
        // setPriority.setAttribute(selected);

        const priorityList = [];
        let toDos = document.getElementById("toDo_list").children;
        
        for (let toDo of toDos){
            let type = toDo.classList;
            let id = toDo.id;
            if (type.contains("imp")){
                priorityList.push("c"+id);
            }
            else if (type.contains("gen")){
                priorityList.push("b"+id);
            }
            else if (type.contains("norm")){
                priorityList.push("a"+id);
            }
        }

        priorityList.sort();
        priorityList.reverse();

        const priorityIds = [];
        for (let pLId of priorityList){
            let id = pLId.split("_");
            priorityIds.push(id[1]);
        }
        // document.getElementById("temp").innerHTML= priorityList.length + " " + priorityList + "<br>" + priorityIds ;
        toDoList(priorityIds);
    }
}
