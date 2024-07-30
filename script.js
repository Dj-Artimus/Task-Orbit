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

let test = document.getElementsByClassName("test")[0];
// function to add toDo
function add(){
    // Get the input values of to-dos from the user and stored in the variables.
    const toDoId = String(date.getTime());
    const toDo = document.getElementById("toDo").value;
    const desc = document.getElementById("desc").value;
    const type = priority();

    // test.innerHTML = toDoId + toDo + desc ;
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
    const divId = "srNo_" + toDoId;
    const doneID = "d_" + toDoId;

    let typeOfTodo;
    if(type=="imp"){
        typeOfTodo = "alert-danger";
    }
    else if(type=="gen"){
        typeOfTodo = "alert-warning text-warning";
    }
    else{
        typeOfTodo = "alert-primary";
    }

    let toDoHTML = `
                <div id="${divId}" class="alert ${typeOfTodo} ${type} toDoElement card" role="alert">
                  <div class="srNos card-header">${srNoCount}</div>
                  <div class="card-body">
                    <h3 class="title card-title">${toDo}</h3>
                    <p class="description card-text">${desc}</p>
                    <div class="form-check form-switch d-inline-block">
                    <input type="checkbox" id="${doneID}" class="done form-check-input"
                      onclick="done(this.id)">
                    <label for="${doneID}" class="doneLabel form-check-label">Mark as DONE </label>
                    </div>
                    <button id="${toDoId}" class="del btn btn-danger" onclick="del(this.id)">Delete</button>
                  </div>
                </div>
    `

    toDoList.innerHTML += toDoHTML;
 
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
    id=id.split("_");
    let markId="srNo_"+id[1];
    let mark = document.getElementById(markId);
    let markLable = mark.childNodes;
    
    if (check){
        mark.style.background = "black";
        mark.style.opacity = "0.7";
        markLable[3].childNodes[5].childNodes[3].innerHTML = "Marked as DONE";
    }
    else{
        mark.style.background = "";
        mark.style.opacity = "1";
        markLable[3].childNodes[5].childNodes[3].innerHTML = "Mark as DONE";
    }
}

var t2 = document.getElementById("t2");
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
