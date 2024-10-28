globalThis.attendencelist=[];
const storedData = JSON.parse(localStorage.getItem('myData'));
document.getElementById('nametransfer').textContent = storedData.name;
document.getElementById('emailtransfer').textContent = storedData.email;


//connect firebase                                                                                            firebase connection
const firebaseConfig = {
    apiKey: "AIzaSyDsGksKFm653M0pZesy4gRTYDb0CkgA8Rw",
    authDomain: "smart-attendance-131af.firebaseapp.com",
    projectId: "smart-attendance-131af",
    storageBucket: "smart-attendance-131af.appspot.com",
    messagingSenderId: "235135958366",
    appId: "1:235135958366:web:d263ede9160e3a11f963cf",
    measurementId: "G-HQPTNG9KEV"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
const db = firebase.firestore();  
document.addEventListener('DOMContentLoaded', function () {

    // Handle menu click events
    const menuItems = document.querySelectorAll('.menu-item, .breadcr , .report-card');

    menuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetId === 'Class') {
                fetchdata('Class');
            }else if(targetId === 'Student_List'){
                fetchdata('Student_List');
            }else if(targetId === 'Add_Student'){
                fetchdata('Add_Student');
            }else if(targetId === 'Attendence'){
                fetchdata('Attendence');
            }

            if (targetSection) {
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                targetSection.classList.add('active');
                if(targetId == 'dashboard'){
                    document.getElementById('pagede').innerHTML='';
                }else{
                    document.getElementById('pagede').innerHTML = '/  ' +targetId;
                }
                document.querySelectorAll('.menu-item').forEach(menu => {
                    menu.classList.remove('active');
                });
                this.classList.add('active');
            }

            const submenu = this.closest('.has-submenu');
            if (submenu) {
                const submenuElement = submenu.querySelector('.submenu');
                submenuElement.style.display = 'none';
            }
        });
    });
});

const addstudentForm = document.getElementById('addStudentform');
addstudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const docname=storedData.admin_UniqueCode+ storedData.email;
    const name=addstudentForm['addname'].value;
    const subject=addstudentForm['addsub'].value;
    const reg=addstudentForm['addreg'].value;
    const section= addstudentForm['addsection'].value;

    checkonline();
db.collection('Students List').doc(docname)
    .set({
        student_ClassName:selecetedsubject,
        student_Name:name,
        student_Regno:reg,
        student_Section: section,
        stuedent_SubjectName:subject
    }).then(() => {
        console.log('added successfully');
        showAlert('customAlert1');
    }).catch((error) => {
        console.error('Error adding document: ', error);
    });
});

//Edit Student Deatails
const editstudentdetails=document.getElementById('editstudentforma');
editstudentdetails.addEventListener('submit',(e)=> {
    e.preventDefault();

    const name=editstudentdetails['editname'].value;
    const subjects=editstudentdetails['editsubject'].value;
    const classes=editstudentdetails['editclass'].value;
    const reg=editstudentdetails['editreg'].value;
    const section= editstudentdetails['editsection'].value;
    
    checkonline();
    var collectionRef = db.collection("Students List");

    // Query documents based on the condition
    collectionRef.where("student_Regno", "==", reg)
    .get()
    .then(function(querySnapshot) {
        if(!querySnapshot.empty){
        querySnapshot.forEach(function(doc) {
            // Get the document reference
            var docRef = doc.ref;
    
            // Modify fields based on condition
            var updatedData = {
                student_ClassName: classes,
                student_Name : name,
                student_Section : section,
                stuedent_SubjectName :subjects
                // Add more fields and modifications as needed
            };
            // Update the document with the modified data
            return docRef.update(updatedData)
            .then(function() {
                console.log("Document successfully updated!");
                showAlert('customAlert');
            })
            .catch(function(error) {
                console.error("Error updating document: ", error);
            });
        });
    }else{
        alert('Student Not Found')
    }
    })
    .catch(function(error) {
        console.error("Error getting documents: ", error);
    });
});



function logout(){
    window.location.href = 'index.html';
    storedData.removeItem('myData');
}

function update(){
    var regno=document.getElementById('editreg').value;
    document.getElementById('editname').value = '';
    document.getElementById('editclass').value = '';
    document.getElementById('editsubject').value = '';
    document.getElementById('editsection').value = '';
    checkonline();
db.collection('Students List').where('student_Regno' , '==' , regno).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            var data = doc.data();  
            document.getElementById('editname').value = data.student_Name;
            document.getElementById('editclass').value = data.student_ClassName;
            document.getElementById('editsubject').value = data.stuedent_SubjectName;
            document.getElementById('editsection').value = data.student_Section;
            
        });
    });
}
function showAlert(alert) {
    const alertElement = document.getElementById(alert);
    alertElement.style.display = "block";
}
function closeAlert(alert) {
    const alertElement = document.getElementById(alert);
    alertElement.style.display = "none";
}
  // Function to create a report card
function createReportCard(student ,count,details_of) {
    const reportCard = document.createElement('div');
    reportCard.classList.add('report-card');
    reportCard.style.display = 'inline-flex';
    reportCard.style.marginLeft = '10px';
    reportCard.style.marginTop = '10px';

    const heading = document.createElement('div');
    reportCard.appendChild(heading);

    const paragraph= document.createElement('h2');
    paragraph.textContent = student ;
    paragraph.style.width = "500px"
    paragraph.style.paddingRight = '10%';
    paragraph.addEventListener('click' ,(e)=> {
        globalThis.selecetedsubject = student ;
        if(details_of === 'Add_Student'){
            document.getElementById('add').classList.add('active');
            document.getElementById(details_of).classList.remove('active');
         }else if(details_of === 'Student_List'){
             retrievedata(student,details_of);
        }else if(details_of === 'Attendence'){
            retrievedata(student,details_of);
        }
    });
    paragraph.style.paddingLeft= '100px';
    paragraph.style.paddingTop= '2%';
    heading.appendChild(paragraph);

    const paragraph2=document.createElement('p');
    paragraph2.textContent = 'Total ' + count;
    paragraph2.style.paddingLeft = '100px';
    heading.appendChild(paragraph2);

    return reportCard;
  }

  // Function to render report cards
function renderReportCards(data,details_of) {
    const reportContainer = document.getElementById(details_of);
    cleandiv(details_of);
    data.forEach((count, subject) => {
        const reportCard = createReportCard(subject, count,details_of,data);
        reportContainer.appendChild(reportCard);
    });
}

function cleandiv(div){
    var del=document.getElementById(div);
    while(del.firstChild){
        del.removeChild(del.firstChild);
    }
}


  // Fetch data from Firestore collection
function fetchdata(details_of) {
    checkonline();
    db.collection('Students List').get()
    .then(snapshot => {
        const studentData = new Map(); // Using Map to store subject as key and count as value

        snapshot.forEach(doc => {
            const docN = doc.id;
            const student = doc.data();
            const student_name= student.student_Name;
            const student_subject =student.stuedent_SubjectName;
            var docdata=storedData.admin_UniqueCode+''+storedData.email+''+student_subject+''+student_name;
            
            if(docN == docdata){
            const student = doc.data();
            const subjectName = student.student_ClassName;

            // Update count for the subject
            if (studentData.has(subjectName)) {
                studentData.set(subjectName, studentData.get(subjectName) + 1);
            } else {
                studentData.set(subjectName, 1);
            }
        }
        });

        // Render report cards and pass the subject count data
        renderReportCards(studentData ,details_of);
    }).catch(error => {
        console.error('Error getting documents: ', error);
    });
}


function retrievedata(student,at) {
    let users=[];
    document.getElementById(at).classList.remove('active');
    checkonline();
    const data=db.collection('Students List');
    data.where('student_ClassName', '==' ,student).get()
        .then(Snapshot => {
            Snapshot.forEach((doc)=>{
            const user = doc.data();
            users.push({
                name: user.student_Name,
                reg: user.student_Regno,
                class: user.student_ClassName,
                sub : user.stuedent_SubjectName,
                section:user.student_Section                 
            });
        });
        if(at==='Student_List'){
            document.getElementById('setails').classList.add('active');
            generateTable(users);
        }else if(at === 'Attendence'){
            document.getElementById('atted').classList.add('active');
            generateAttendence(users);
        }
    }).catch((error)=>{
        console.error('ERROR : ',error);
    });
}
 
 // Function to display results in a table
 function generateTable(data) {
    clean('#details tbody');
    const table = document.getElementById('details');
    const tbody = table.createTBody();
    // Create table body
    data.forEach(user => {
      const row = tbody.insertRow();
      row.insertCell().textContent = user.name;
      row.insertCell().textContent = user.reg;
      row.insertCell().textContent = user.class;
      
    });
}
function clean(atr){
    var tbody1 = document.querySelector(atr);
    if(tbody1){
        tbody1.remove();
    }
}

function generateAttendence(data){
    clean('#datend tbody');
    const table1 = document.getElementById('datend');
    const tbody = table1.createTBody();
    // Create table body
    data.forEach(user => {
      const row = tbody.insertRow();
      row.insertCell().textContent = user.name;
      row.insertCell().textContent = user.reg;
      row.insertCell().textContent = user.class;
      var per='Present';
      var ab='Absent';
      var input = '<input type="radio" name="' + user.name + '" onclick="markattendence(\'' + user.name + '\', \'' + user.reg + '\', \'' + user.class + '\', \'' + per + '\', \'' + user.section+ '\', \'' + user.sub + '\')" value="Present">Present<br>' +
            '<input type="radio" name="' + user.name + '" onclick="markattendence(\'' + user.name + '\', \'' + user.reg + '\', \'' + user.class + '\', \'' + ab + '\', \'' + user.section+ '\', \'' + user.sub + '\')" value="Absent">Absent';


      row.insertCell().innerHTML = input;
    });
}

const attendrecord=document.getElementById('attendence_from');
attendrecord.addEventListener('submit',(e)=>{
    e.preventDefault();

    attendencelist.forEach(data=>{
        storefirebase(data);
    });

});

function markattendence(name , reg , clas, atted,sec,sub ){
    //stored attendance details 
    const attendence ={};
    attendence.name=name;
    attendence.reg=reg;
    attendence.class=clas;
    attendence.attendence=atted;
    attendence.section=sec;
    attendence.subject=sub;
    attendencelist.push(attendence);
}

function storefirebase(data){
    //current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;   
    
    //current time
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    var docname = storedData.admin_UniqueCode+''+storedData.email+''+formattedDate+''+formattedTime+''+data.name;
    var collection_name=storedData.admin_UniqueCode+'Marked Attendance List';
    checkonline();
db.collection(collection_name).doc(docname)
    .set({
        attendance: data.attendence,
        date: formattedDate,
        gmail : storedData.email,
        regno: data.reg,
        student_CLASS: data.class,
        student_NAME:data.name,
        student_SECTION: data.section,
        subject_NAME : data.subject,
        time: formattedTime
    }).then(()=>{
        console.log("Document successfully written!");
        alert('Attendance Added Successfully');
    }).catch((e)=>{
        console.error('ERROR',e );
    })
}

function checkonline(){
    if (!navigator.onLine) {
      alert('No internet connection. Please try again later.');
      return;
    }
  }
