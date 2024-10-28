globalThis.subjectlist ={};
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

const storedData = JSON.parse(localStorage.getItem('myData'));
document.getElementById('nametransfer').textContent = storedData.name;
document.getElementById('emailtransfer').textContent = storedData.email;

function logout(){
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {

    // Handle menu click events
    const menuItems = document.querySelectorAll('.menu-item, .breadcr , .report-card');

    menuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetId === 'Class') {
                fetchtedata('Class');
            }else if(targetId === 'Teacher'){
                fetchdata('Teacher');
            }else if(targetId === 'Add_Student'){
                fetchtedata('Add_Student');
            }


            if (targetSection) {
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                targetSection.classList.add('active');
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

function fetchdata(details_of) {
    checkonline();
db.collection('Teachers List').where('adminCode','==',storedData.admin_UniqueCode).get()
    .then(snapshot => {
        const studentDat = new Map(); // Using Map to store subject as key and count as value
        
        snapshot.forEach(doc => {
            
            const student = doc.data();
            const Teacher_name = student.teacher_Name;

            if (studentDat.has(Teacher_name)) {
                studentDat.setwq(Teacher_name, studentDat.get(Teacher_name) + 1);
            } else {
                studentDat.set(Teacher_name, 1);
            }
        });

        // Render report cards and pass the subject count data
        renderReportCards(studentDat ,details_of);
    }).catch(error => {
        console.error('Error getting documents: ', error);
    });
}

function fetchtedata(details_of) {
    checkonline();
    db.collection('Students List').get()
    .then(snapshot => {
        const studentData = new Map(); // Using Map to store subject as key and count as value

        snapshot.forEach(doc => {
            const docN = doc.id;    
            var docdata=storedData.admin_UniqueCode;
            
            if(docN.includes(docdata)){
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

function clean(div){
    var del=document.getElementById(div);
    while(del.firstChild){
        del.removeChild(del.firstChild);
    }
}

function renderReportCards(data,details_of) {
    const reportContainer = document.getElementById(details_of);
    clean(details_of);
    data.forEach((count, subject) => {
        const reportCard = createReportCard(subject, count,details_of);
        reportContainer.appendChild(reportCard);
    });
}
function createReportCard(student ,count,details_of) {
    const reportCard = document.createElement('div');
    reportCard.classList.add('report-card');
    reportCard.style.display = 'inline-flex';
    reportCard.style.marginLeft = '2%';
    reportCard.style.marginTop = '2%';
    if(details_of== 'Class'){
        reportCard.style.cursor = "pointer";    
    }

    const heading = document.createElement('div');
    reportCard.appendChild(heading);
    reportCard.addEventListener('click',(e)=>{
        if(details_of=='Class'){
            retrievedata(student,details_of);
        }else if(details_of == 'Add_Student'){
            document.getElementById('addst').classList.add('active');
            document.getElementById(details_of).classList.remove('active');
        }
    });


    const paragraph= document.createElement('h2');
    paragraph.textContent = student ;  
    paragraph.style.width = "500px"
    paragraph.style.paddingLeft= '10%';
    paragraph.style.paddingRight = '10%';
    paragraph.style.paddingTop= '1%';
    heading.appendChild(paragraph);

    const paragraph2=document.createElement('p');
    paragraph2.textContent = 'Total student ' + count;
    paragraph2.style.paddingLeft = '12%';
    paragraph2.style.paddingRight = '10%';
    heading.appendChild(paragraph2);

    return reportCard;
}

function retrievedata(student,at) {
    try{
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
            if(at == 'Class'){
                document.getElementById('setails').classList.add('active');
                generateTable(users);
            }
         });
    }catch(error){
         console.error('ERROR : ',error);
    }
 }
 
 // Function to display results in a table
 function generateTable(data) {
    cleandiv('#details tbody');
    const table = document.getElementById('details');
    const tbody = table.createTBody();
    // Create table body
    data.forEach(user => {
      const row = tbody.insertRow();
      row.insertCell().textContent = user.name;
      row.insertCell().textContent = user.reg;
      row.insertCell().textContent = user.class;
      
    })
 }
 function cleandiv(atr){
    var tbody1 = document.querySelector(atr);
    if(tbody1){
        tbody1.remove();
    }
} 

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



function check(dora){
    var email=document.getElementById('removemail').value;
    document.getElementById(dora).value = '';
    checkonline();
    db.collection('Teachers List').where('email' , '==' , email).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            var data = doc.data();  
            document.getElementById(dora).value = data.teacher_Name;
        });
    });
}


const editt= document.getElementById('forma');
editt.addEventListener('submit',(e)=>{
    e.preventDefault();
    var email=editt['editmail'].value;
    var name=editt['editname'].value;
    
    db.collection('Teachers List').where('email','==',email)
    .get().then((snapshot) => {
        snapshot.forEach((doc) => {
            var data = doc.ref;
            var update={
                teacher_Name:name
            }
            data.update(update).then(() => {
                console.log('Document successfully updated!');
            }).catch((error)=>{
                console.error('error on edit teacher detils',error);
            });
        }); 
    });
});




const rem=document.getElementById('remove');
rem.addEventListener('submit',(e)=>{
    e.preventDefault();

    var email=document.getElementById('removemail').value;
    checkonline();
    db.collection('Teachers List').where('email' , '==' , email)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.delete()
                .then(() => {
                    console.log(`Document with ID ${doc.id} deleted successfully from collection Teachers List`);
                })
                .catch((error) => {
                    console.error(`Error deleting document with ID ${doc.id}: `, error);
                });
        });      
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
});
function showAlert(alert) {
    const alertElement = document.getElementById(alert);
    alertElement.style.display = "block";
}
function closeAlert(alert) {
    const alertElement = document.getElementById(alert);
    alertElement.style.display = "none";
}

function checkonline(){
    if (!navigator.onLine) {
      alert('No internet connection. Please try again later.');
      return;
    }
}

const addteacher = document.getElementById('addteacher');
addteacher.addEventListener('submit', (e) => {
    e.preventDefault();

    const name=addteacher['addname'].value;
    const email=addteacher['email'].value;
    const password =addteacher['password'].value;
    const num= addteacher['num'].value;
  
    checkonline();
    db.collection('Teachers List').add({
        sadminCode:storedData.admin_UniqueCode,
        teacher_Name:name,
        email:email,
        confirm_Password: password,
        password:password,
        phoneNumber:'+91'+num
    }).then(() => {
        console.log('added successfully');
        alert('Added Teacher Successfully');
    }).catch((error) => {
         console.error('Error adding document: ', error);
    });
});
