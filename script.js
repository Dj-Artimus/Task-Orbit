
themeMode()

const testDB = document.getElementsByClassName("testDB")[0];
const signUpForm = document.getElementById("signUpForm");
const loginForm = document.getElementById("loginForm");
const toDoForm = document.getElementById("toDoForm");
const toDoEditForm = document.getElementById("toDoEditForm");
const closeForm = document.getElementById("closeForm");
const closeLoginForm = document.getElementById("closeLoginForm");
const toDoListDiv = document.getElementById("toDo_list");
let toDoSrNoCounter = 1 ;
let missionsCompleted = 0;

createDataBase();

const toDoDataBase = JSON.parse(localStorage.getItem("toDoDataBase"));
const today = new Date().toLocaleString().split(",");


signUpForm.addEventListener("submit", (e) => {
    const username = document.getElementById("username").value;
    const users = Object.keys(toDoDataBase.users);
    if(users.includes(username)){
        document.getElementById("signUpAlert").innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                Username is already taken. <br> Please select different username
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
        `
        e.preventDefault();
        
    }
    else{
        createUser();
        document.getElementById("signUpAlert").innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
                Successfully Sign Up
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
        `

    }
})

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const users = Object.keys(toDoDataBase.users);
    if((toDoDataBase.currentUser[1]===username)&&(toDoDataBase.currentUser[2]===password)){
        document.getElementById("loginAlert").innerHTML = `
        <div class="alert alert-primary alert-dismissible fade show" role="alert">
                You are already Loged In.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
        `

    }
    else if(users.includes(username)){
        e.preventDefault();
        const userPassword = toDoDataBase.users[username][2];
        if(password === userPassword){
            toDoDataBase.currentUser = 
            toDoDataBase.users[username];
            localStorage.setItem("toDoDataBase",JSON.stringify(toDoDataBase))
            document.getElementById("loginAlert").innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                Successfully Loged In
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            setTimeout(() => {
                loginForm.reset();
                closeLoginForm.click();
                location.reload(true);
            }, 1000);

        }
        else{
            document.getElementById("loginAlert").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Wrong Password. Try Again
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
        `
        }
    }
    else{
        document.getElementById("loginAlert").innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                Username not found ! Kindly Sign Up
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
        `
        
    }
})


toDoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const type = priority();

    addToDoToDataBase(title,desc,type);

    toDoForm.reset();
    closeForm.click();
})

toDoEditForm.addEventListener("submit", () => {

    const toDoId = document.getElementById("editTitle").getAttribute("data-toDoId");
    const title = document.getElementById("editTitle").value;
    const desc = document.getElementById("editDesc").value;
    const type = editPriority();

    editToDoToDataBase(toDoId,title,desc,type);
    console.log(toDoId,title,desc,type)
})


function createDataBase(){
    if(!(localStorage.getItem("toDoDataBase"))){
        const toDoDB = {
            currentUser : [],
            users : {},
            toDoListSortMethod : "Default" ,
            usersToDoData : {}
        }
        localStorage.setItem("toDoDataBase",JSON.stringify(toDoDB))
    }
}

function createUser(){

    const users = toDoDataBase.users;
    const usersToDoData = toDoDataBase.usersToDoData;

    const userDetails = {};
    const uName = document.getElementById("name");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    userDetails.name = uName.value ;
    userDetails.username = username.value ;
    userDetails.password = password.value ;

    users[username.value] = Object.values(userDetails);
    
    toDoDataBase.currentUser = Object.values(userDetails);

    usersToDoData[username.value+"|s_toDoData"]={};

    localStorage.setItem("toDoDataBase",JSON.stringify(toDoDataBase))
}

function createDatedToDoData(){
    const user = toDoDataBase
    .currentUser[1] + "|s_toDoData";

    const datedToDoData = Object.keys(toDoDataBase.usersToDoData[user]).includes(today[0]);
    if(!datedToDoData){
        toDoDataBase.usersToDoData[user][today[0]] = {};
        localStorage.setItem("toDoDataBase", JSON.stringify(toDoDataBase))
    }
}

function addToDoToDataBase(title,desc,type,isDone = false){
    try {
        
        const usersToDoData = toDoDataBase.usersToDoData;
        const user = toDoDataBase.currentUser[1];
        
        const userData = usersToDoData[user+"|s_toDoData"];
        createDatedToDoData();
        const toDoId = new Date().getTime();
        userData[today[0]][toDoId] = [toDoId,title,desc,type,isDone,today[1]];
        localStorage.setItem("toDoDataBase", JSON.stringify(toDoDataBase));
        location.reload(true);

    } catch (error) {
        testDB.innerHTML = "You are not loged in. <br> Please Login or Sign-Up to create your To dos" ;
    }
    }

function priority(){
    if (document.getElementById("prime").checked){
        return "prime";
    }
    else if (document.getElementById("power").checked){
        return "power";
    }
    else { return "lite"; }
}
function editPriority(){
    if (document.getElementById("edit_prime").checked){
        return "prime";
    }
    else if (document.getElementById("edit_power").checked){
        return "power";
    }
    else { return "lite"; }
}


function createToDo(id,title,desc,type,isDone,time,srNo){
    let typeOfTodo;
    if(type=="prime"){
        typeOfTodo = "alert-danger";
    }
    else if(type=="power"){
        typeOfTodo = "alert-primary";
    }
    else{
        typeOfTodo = "alert-warning";
    }

    let check = undefined;
    if (isDone){
        check = "checked";
    }

    let toDoHTML = `
                <div id="${id}" class=" rounded-3 p-2  alert ${typeOfTodo} ${type} toDoElement card" role="alert">
    
                  <div class="srNos p-1 px-2 card-header d-flex justify-content-between bg-transpa rent">
                
                  <div class="d-inline-block pt-1 px-1">
                    ${srNo} 
                    <span class=" opacity-25" >↓</span> ${time} 
                    </div>
                    <div class="d-inline-block">
                    
                  <i id="${"editId_" + id}" onclick="edit(this.id)" class=" p-0 px-1 bi bi-pencil-square btn" data-bs-toggle="modal" data-bs-target="#editToDoModal" data-bs-whatever="@mdo"></i><i id="${"delId_" + id}" onclick="del(this.id)" class="p-1 bi bi-trash3-fill btn"></i>
                  </div>
                  </div>
                  <div class="card-body ">
                    <h3 class="title card-title">${title}</h3>
                    <p class="description card-text">${desc}<input type="checkbox" id="${"markId_" + id}" class=" float-end done form-check-input border-info border-opacity-50"
                    onclick="done(this.id)" style="font-size:14px; transform:translateX(6px) translateY(12px); cursor:pointer;" ${check}></p>
                    
                  </div>
                  
                </div>
    `

    toDoListDiv.innerHTML += toDoHTML;
    createDone(id,isDone);
}

function done(id){
    let check = document.getElementById(id).checked;
    id=id.split("_")[1];
    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";

    if(check){
        toDoDataBase
        .usersToDoData[currentUserData]
        [today[0]][id][4] = check;
        localStorage.setItem("toDoDataBase", JSON.stringify(toDoDataBase));
        missionsCompleted++;
    }
    else{
        toDoDataBase
        .usersToDoData[currentUserData]
        [today[0]][id][4] = check;
        localStorage.setItem("toDoDataBase", JSON.stringify(toDoDataBase));
        missionsCompleted--;
    }
    progressTrack();
    createDone(id,check);       
}

function createDone(id,check){
    let markId= "markId_" + id;
    let checkId = document.getElementById(markId);
    checkId.checked = check;
    let mark = document.getElementById(id);
    // let markLable = mark.childNodes;
    
    if (check){
        if(window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches){
        mark.style.background = "black";}
        else{
        mark.style.background = "whitesmoke";}
        mark.style.opacity = "0.8";
        // markLable[3].childNodes[5].childNodes[3].innerHTML = "Marked as DONE";
    }
    else{
        mark.style.background = "";
        mark.style.opacity = "1";
        // markLable[3].childNodes[5].childNodes[3].innerHTML = "Mark as DONE";
    }
}

function del(id){
    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";
    id = id.split("_")[1];

    toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][id] = undefined ;
    localStorage.setItem("toDoDataBase", JSON.stringify(toDoDataBase));
    location.reload(true);
}

function edit(id){
    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";
    id = id.split("_")[1];
    const type = "edit_" + toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][id][3];

    let editTitle = document.getElementById("editTitle");
    let editDesc = document.getElementById("editDesc");
    const editType = document.getElementById(type);

    editTitle.value = toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][id][1];
    editDesc.value = toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][id][2];
    editType.setAttribute("checked",true);

    editTitle.setAttribute("data-toDoId",id);

}

function editToDoToDataBase(toDoId,title,desc,type){
    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";

    toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][toDoId][1] = title ;
    toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][toDoId][2] = desc ;
    toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]][toDoId][3] = type ;
    localStorage.setItem("toDoDataBase", JSON.stringify(toDoDataBase));
    location.reload(true);

}

function progressTrack(){
    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";
    const todaysToDoData = toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]];
    const totalMissions = Object.keys(todaysToDoData).length ;
    const progress = document.getElementById("progress");
    const progressBar = document.getElementById("progressBar");
    progress.innerHTML = `${missionsCompleted}/${totalMissions}`
    progressBar.style.width = `${(missionsCompleted/totalMissions)*100}%`

    switch((missionsCompleted/totalMissions)*100){
    case(100):
        progressBar.innerHTML = "Orbit Completed" ;
        break;  
    default:
        progressBar.innerHTML = "Keep Orbiting"
    }
}

function calender(){

    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";
    const orbitsData = toDoDataBase
    .usersToDoData[currentUserData];
    const orbits = Object.keys(toDoDataBase
    .usersToDoData[currentUserData]);

    const calender = document.getElementById("calender");
    const prevDay = document.getElementById("prevDay");
    const nextDay = document.getElementById("nextDay");
    let dateToggle = 0;
    let orbitToggle = 1;
    const date = new Date().getTime();
    const today = new Date((date)-((1000*60*60*24)*dateToggle)).toDateString();
    calender.innerHTML = today;

    // console.log(orbitsData[orbits[orbits.length-1]]);
    console.log(toDoDataBase
        .usersToDoData[currentUserData][orbits[orbits.length-1]]);
    
    prevDay.addEventListener("click",() => {
        toDoListDiv.innerHTML = " ";
        dateToggle++;
        orbitToggle++;
        const today = new Date((date)-((1000*60*60*24)*dateToggle)).toDateString();
        calender.innerHTML = today;
        renderMissions(toDoDataBase
            .usersToDoData[currentUserData][orbits[orbits.length-orbitToggle]]);


    });
    nextDay.addEventListener("click",() => {
        toDoListDiv.innerHTML = "";
        dateToggle--;
        orbitToggle--;
        const today = new Date((date)-((1000*60*60*24)*dateToggle)).toDateString();
        calender.innerHTML = today;
        renderMissions(toDoDataBase
            .usersToDoData[currentUserData][orbits[orbits.length-orbitToggle]]);
    });
}
calender();

function renderMissions(todaysOrbit){
    let srNo = 1;
    for (let todoId in todaysOrbit ){
        const todo = todaysOrbit[todoId];
        let id = todo[0];
        let title = todo[1];
        let desc = todo[2];
        let type = todo[3];
        let isDone = todo[4];
        let time = todo[5];

        if (isDone){missionsCompleted++};
        progressTrack();
        
        createToDo(id,title,desc,type,isDone,time,srNo);
        srNo++;
    }
}
try {
    const currentUserData = 
    toDoDataBase.currentUser[1] + "|s_toDoData";
    const todaysToDoData = toDoDataBase
    .usersToDoData[currentUserData]
    [today[0]];

    renderMissions(todaysToDoData);
} catch (error) {
    
}

function themeMode(){
    if(window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches){
        document.body.setAttribute("data-bs-theme","dark");
    }
    else{
        document.body.removeAttribute("data-bs-theme");
    }
}


console.log("all good");

// testDB.innerHTML= `<div style="width:80px; text-align:center; line-height:17px; text-transform:uppercase;">${new Date().toDateString()}</div>`