async function getAllmentors() {
    currentURL = 'http://localhost:3000/mentors';
    let response = await fetch(currentURL);
    let data = await response.text();
    let parsedData = JSON.parse(data)
    console.log(parsedData)
    if(parsedData) displayMentorsList (parsedData);
    else alert('Something Went wrong, Please try again later')
}

function displayMentorsList(data){
    document.getElementById('mentorsList').innerHTML = '';
    var headList = document.createElement('li');
    headList.setAttribute('class', 'list-group-item list-group-item-action active');
    headList.innerText = 'Mentors List';
    document.getElementById('mentorsList').append(headList);

    data.forEach(mentor => {
        var list = document.createElement('li');
        list.setAttribute('class', 'list-group-item list-group-item-action');
        list.innerHTML = mentor.name + `<button type="button" class="btn btn-success float-right btn-sm" onclick="getMentorsStudents('${mentor.id}')">Check Assigned Students</button>`;
        document.getElementById('mentorsList').append(list);
    });
}

async function getMentorsStudents(mentorId){
    currentURL = 'http://localhost:3000/students/'+mentorId;
    let response = await fetch(currentURL);
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data)
        console.log(parsedData)
        displayAssignedStudentsList (parsedData);
    }
    else alert('Something Went wrong, Please try again later')
}

function displayAssignedStudentsList(data){
    document.getElementById('studentsList').innerHTML = '';
    document.getElementById('changeMentorsList').innerHTML = '';
    document.getElementById('studentsList').style.display = "block";
    var headList = document.createElement('li');
    headList.setAttribute('class', 'list-group-item list-group-item-action active');
    headList.innerText = 'Assigned Students';
    document.getElementById('studentsList').append(headList);

    data.forEach(student => {
        var list = document.createElement('li');
        list.setAttribute('class', 'list-group-item list-group-item-action');
        list.innerHTML = student.name + `<button type="button" class="btn btn-success float-right btn-sm" onclick="getUnassignedMentors('${student.id}')">Assign New mentor</button>`;
        document.getElementById('studentsList').append(list);
    });
}

async function getUnassignedMentors(studentID){
    currentURL = 'http://localhost:3000/unassignedmentors/'+studentID;
    let response = await fetch(currentURL);
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data)
        console.log(parsedData)
        displayunassignedMentors (parsedData);
    }
    else alert('Something Went wrong, Please try again later')
}


function displayunassignedMentors(data){
    document.getElementById('changeMentorsList').innerHTML = '';
    document.getElementById('changeMentorsList').style.display = "block";
    var headList = document.createElement('li');
    headList.setAttribute('class', 'list-group-item list-group-item-action active');
    headList.innerText = 'mentors available for assignation';
    document.getElementById('changeMentorsList').append(headList);
    mentorData = data.mentors;
    studentData = data.student;
    mentorData.forEach(mentor => {
        var list = document.createElement('li');
        list.setAttribute('class', 'list-group-item list-group-item-action');
        list.innerHTML = mentor.name + `<button type="button" class="btn btn-success float-right btn-sm" onclick="assignNewMentor('${mentor.id}', '${studentData.id}')">Assign</button>`;
        document.getElementById('changeMentorsList').append(list);
    });
}

async function assignNewMentor(mentorid, studentid){
    currentURL = 'http://localhost:3000/changeMentor/';
    let response = await fetch(currentURL, {method: "POST", body: JSON.stringify({mentorId: mentorid, studentId: studentid}), headers: { "Content-type": "application/json; charset=UTF-8" } });
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data)
        displayAssignedStudentsList (parsedData);
        document.getElementById('changeMentorsList').style.display = "none";
    }
    else alert('Something Went wrong, Please try again later')
}

async function unassignedStudents(){
    currentURL = 'http://localhost:3000/unassignedstudents/';
    let response = await fetch(currentURL);
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data)
        displayunassignedStudentsList (parsedData);
        document.getElementById('changeMentorsList').style.display = "none";
    }
    else alert('Something Went wrong, Please try again later')
}

function displayunassignedStudentsList(data){
    document.getElementById('allunassignedStudents').innerHTML = '';
    document.getElementById('availmentorList').innerHTML = '';
    var headList = document.createElement('li');
    headList.setAttribute('class', 'list-group-item list-group-item-action active');
    headList.innerText = 'All Unassigned Students';
    document.getElementById('allunassignedStudents').append(headList);

    data.forEach(student => {
        var list = document.createElement('li');
        list.href = `javascript:showavailableMentors('${student.id}')`;
        list.setAttribute('class', 'list-group-item list-group-item-action');
        list.innerHTML = student.name + `<button type="button" class="btn btn-success float-right btn-sm" onclick="showavailableMentors('${student.id}')">Check Available mentors</button>`;
        document.getElementById('allunassignedStudents').append(list);
    });
}

async function showavailableMentors(studentId) {
    currentURL = 'http://localhost:3000/mentors';
    let response = await fetch(currentURL);
    let data = await response.text();
    let parsedData = JSON.parse(data)
    console.log(parsedData)
    if(parsedData) displayavailMentorsList (parsedData, studentId);
    else alert('Something Went wrong, Please try again later')
}

function displayavailMentorsList(data, studentId){
    document.getElementById('availmentorList').innerHTML = '';
    var headList = document.createElement('li');
    headList.setAttribute('class', 'list-group-item list-group-item-action active');
    headList.innerText = 'Available Mentors List';
    document.getElementById('availmentorList').append(headList);

    data.forEach(mentor => {
        var list = document.createElement('li');
        list.setAttribute('class', 'list-group-item list-group-item-action');
        list.innerHTML = mentor.name + `<button type="button" class="btn btn-success float-right btn-sm" onclick="assignStudentsmentor('${mentor.id}', '${studentId}')">Assign</button>`;
        document.getElementById('availmentorList').append(list);
    });
}

async function assignStudentsmentor(mentorid, studentid){
    currentURL = 'http://localhost:3000/assignMentor/';
    let response = await fetch(currentURL, {method: "POST", body: JSON.stringify({mentor: mentorid, students: studentid}), headers: { "Content-type": "application/json; charset=UTF-8" } });
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data);
        displayunassignedStudentsList(parsedData);
    }
    else alert('Something Went wrong, Please try again later')
}


async function addMentor(){
    currentURL = 'http://localhost:3000/addMentor/';
    mentorName = document.getElementById('mentorName').value;
    let response = await fetch(currentURL, {method: "POST", body: JSON.stringify({name: mentorName}), headers: { "Content-type": "application/json; charset=UTF-8" } });
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        displayMentorsList(parsedData);
    }
    else alert('Something Went wrong, Please try again later')
}

async function addStudent(){
    currentURL = 'http://localhost:3000/addStudent/';
    studentname = document.getElementById('studentName').value;
    let response = await fetch(currentURL, {method: "POST", body: JSON.stringify({name: studentname}), headers: { "Content-type": "application/json; charset=UTF-8" } });
    let data = await response.text();
    if(data){
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        displayunassignedStudentsList(parsedData);
    }
    else alert('Something Went wrong, Please try again later')
}


getAllmentors()
unassignedStudents()