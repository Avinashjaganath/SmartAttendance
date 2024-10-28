const storedData = JSON.parse(localStorage.getItem('myData')); 
document.getElementById('nametransfer').textContent = storedData.name;
document.getElementById('emailtransfer').textContent = storedData.email;


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
db.collection('Parents List').where('email','==',storedData.email).get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        globalThis.Regno_Glo=doc.data().studentRegNo;
        
    });
})
document.addEventListener('DOMContentLoaded', function () {

    // Handle menu click events
    const menuItems = document.querySelectorAll('.menu-item, .report-card');

    menuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if(targetId=='Student'){
                studentid();
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
        });
    });  
});

function logout(){
    window.location.href = 'index.html';
    storedData.removeItem('myData');
}

function studentid(){
    // Fetch data from Firestore
    db.collection('Students List').where('student_Regno', '==', Regno_Glo).get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            alert('No student found with the given registration number.');
            return;
        }
        snapshot.forEach(doc => {
            console.log('rec');
            var data = doc.data();
            var name = data.student_Name;
            var sec = data.student_Section;
            var clas = data.student_ClassName;
            var regno = data.student_Regno;

            // Update the DOM with the fetched data
            document.getElementById('stname').textContent = name;
            document.getElementById('stclass').textContent = clas;
            document.getElementById('stregno').textContent = regno;
            document.getElementById('stsec').textContent = sec;
        });
    }).catch(error => {
        console.error('Error getting documents: ', error);
        alert('Error fetching student data.');
    });
}

var gettoday=document.getElementById('gettoday');
gettoday.addEventListener('submit',(e)=>{
    e.preventDefault();
    var dat = document.getElementById('date').value;
    if(!dat){
        var selectedDate= new Date();
    }else{
        var selectedDate = new Date(dat);
    }
    var col = storedData.admin_UniqueCode + 'Marked Attendance List';
    
    // Calculate the first day of the previous month
    var firstDayOfPreviousMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);

    // Perform the Firestore query
    db.collection(col).where('regno', '==', Regno_Glo).get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            alert('No student found with the given registration number.');
            return;
        }

        const studentData = new Map(); // Using Map to store subject as key and count as value

        snapshot.forEach(doc => {
            const student = doc.data();
            var docDate = new Date(student.date.split('-').reverse().join('-')); // Convert stored date to Date object
            
            // Check if the document date is within the range from the first day of the previous month up to the selected date
            if (docDate >= firstDayOfPreviousMonth && docDate <= selectedDate) {                
                    const clas= student.subject_NAME;
                    // Update count for the subject
                    if (studentData.has(clas)) {
                        studentData.set(clas, studentData.get(clas) + 1);
                    } else {
                        studentData.set(clas, 1);
                    }
                }
        });
        if(studentData.size===0){
            var div=document.getElementById('todayat');
            const paragraph= document.createElement('h2');
            paragraph.textContent = "No attendance found till the given date." ;  
            div.appendChild(paragraph);
            alert('No attendance found till the given date.');
        }
        console.log(studentData);
        // Render report cards and pass the subject count data
        renderReportCards(studentData);
    }).catch(error => {
        console.error('Error getting documents: ', error);
    });
});

function renderReportCards(data) {
    const reportContainer = document.getElementById('todayat');
    cleandiv('todayat');
    clean('#todayclass tbody');
    data.forEach((count, subject) => {
        const reportCard = createReportCard(subject,count);
        reportContainer.appendChild(reportCard);
    });
}
function createReportCard(student ,count) {
    const reportCard = document.createElement('div');
    reportCard.classList.add('report-car');
    reportCard.style.display = 'inline-flex';
    reportCard.style.marginLeft = '5px';
    reportCard.style.marginTop = '15px';
    reportCard.style.background= 'wheat';

    const heading = document.createElement('div');
    reportCard.appendChild(heading);
    
    const paragraph= document.createElement('h2');
    paragraph.textContent = student ;
    paragraph.style.width = "500px"
    paragraph.style.paddingRight = '10%';
    paragraph.style.paddingLeft= '100px';
    paragraph.style.paddingTop= '2%';
    paragraph.addEventListener('click',(e)=>{
        e.preventDefault();
        generateTable(student);
    });

    heading.appendChild(paragraph);



    const paragraph2=document.createElement('p');
    paragraph2.textContent = 'Total ' + count;
    paragraph2.style.paddingLeft = '100px';
    heading.appendChild(paragraph2);

    const paragraph3=document.createElement('p');
    paragraph3.textContent = 'minimum class' + Math.round( count *(75/100)) ;
    paragraph3.style.paddingLeft = '100px';
    heading.appendChild(paragraph3);


    return reportCard;
  }

function generateTable(data) {
    document.getElementById('btn').style.display= 'block';
    var dat = document.getElementById('date').value;
    if(!dat){
        var selectedDate= new Date();
    }else{
        var selectedDate = new Date(dat);
    }
    var day = ('0' + selectedDate.getDate()).slice(-2);
    const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
    var year = selectedDate.getFullYear();
    var today = day + '-' + month + '-' + year;

    var firstDayOfPreviousMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    //current date
    clean('#todayclass tbody');
    const table = document.getElementById('todayclass');
    document.getElementById('regnopri').textContent = Regno_Glo ;

    table.style.display='block';
    const tbody = table.createTBody();
    document.getElementById('date').textContent='Date : '+today;
    
    // Create table body
    var col = storedData.admin_UniqueCode+'Marked Attendance List';
    db.collection(col).where('regno','==',Regno_Glo).where('subject_NAME','==',data).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            var docDate = new Date(doc.data().date.split('-').reverse().join('-')); // Convert stored date to Date object
            console.log(docDate, selectedDate);
            
            // Check if the document date is within the range from the first day of the previous month up to the selected date
            if (docDate >= firstDayOfPreviousMonth && docDate <= selectedDate) {      
                var user = doc.data();
                const row = tbody.insertRow();
                row.insertCell().textContent = user.student_CLASS;
                row.insertCell().textContent = user.time;
                row.insertCell().textContent = user.date;
                row.insertCell().textContent = user.attendance;
                document.getElementById('classpri').textContent= 'Subject : '+user.subject_NAME;
            }
        });
    }).catch((error)=>{
        console.error(error);
    });
    console.log(tbody);
}

function clean(atr){
    var tbody1 = document.querySelector(atr);
    if(tbody1){
        tbody1.remove();
    }
}

function cleandiv(div){
    var del=document.getElementById(div);
    while(del.firstChild){
        del.removeChild(del.firstChild);
    }
}

//generate pdf
function pdf() {
        window.print();
}
