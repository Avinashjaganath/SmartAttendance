globalThis.re='';
globalThis.Condition='';

function final(person){
  re=person;
  if(person=='Admin List'){
    document.getElementById('loginpe').textContent= 'Admin Login';
    document.getElementById('regi').textContent='Admin Sign Up';
    document.getElementById('p-regno').style.display='none';
    document.getElementById('p-phone').style.display='none';
    document.getElementById('college').style.display='block';
  }else if(person=='Parents List'){
    document.getElementById('loginpe').textContent= 'Parent Login';
    document.getElementById('regi').textContent='Parent Sign Up';
    document.getElementById('p-regno').style.display='block';
    document.getElementById('p-phone').style.display='block';
    document.getElementById('college').style.display='none';
  }else {
    document.getElementById('loginpe').textContent= 'Teacher Login';
    document.getElementById('regi').textContent='Teacher Sign Up';

  }
  return re;
}


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
const db = firebase.firestore();                                                                          //---------------------------------                                                   
// Reference to the registration form and Login 
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('LoginForm');
registerForm.addEventListener('submit', (e) => {                                                           //registration form
  e.preventDefault();

  // Get form values
  const firstName = registerForm['name'].value;
  const college = registerForm['college-in'].value;
  const email = registerForm['email'].value;
  const password = registerForm['password'].value;
  const confirm = registerForm['confirm'].value;
  const regno =registerForm['p-regno-in'].value;
  const phone = registerForm['p-phone-no'].value;
  const selectedOption=re;
  if( selectedOption==null){
    alert("Please select an option");
  }else if(selectedOption=='Admin List'){
    checkonline();
    globalThis.adminc=generateRandomCode();
    globalThis.Condition='passed';
    db.collection('Admin List').add({
      admin_Name: firstName,
      password:password,
      confirm_Password:confirm,
      email: email,
      sc_Name: college,
      admin_UniqueCode:adminc
    }).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      alert(adminc);
      // Optional: Redirect to a new page or show a success message
      formContainer.classList.remove("active");
    }).catch((error) => {
      console.error('Error Login : ', error);
    });
  }else if(selectedOption=='Parents List'){
    checkonline();
    db.collection('Parents List').add({
      parent_Name: firstName,
      password:password,
      confirm_Password:confirm,
      email: email,
      studentRegNo : regno,
      phoneNumber : phone
    }).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      // Optional: Redirect to a new page or show a success message
      formContainer.classList.remove("active");
    }).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }
 
  });                                                                                         //-------------------------------------
  //login data retrieval                                                                       Login Form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission

  // Get form values
  const email = loginForm['login_email'].value;
  const password = loginForm['login_password'].value;
  const unique = loginForm['secrt'].value;
  const selectedOption =re;

  if (selectedOption === '') {
    document.getElementById('loginStatus').textContent = 'Please select the login type';
  } else {
    checkonline();
    
      // Retrieve user data from Firestore
    db.collection(selectedOption).where('email', '==', email).where('password', '==', password).get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          document.getElementById('loginStatus').textContent = 'Invalid email or password';
        } else {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            let data;

            if (selectedOption === 'Admin List' ) {
              if(userData.admin_UniqueCode == unique){
                data = {
                  'email': email,
                  'admin_UniqueCode': unique,
                  'name': userData.admin_Name
                };
                localStorage.setItem('myData', JSON.stringify(data));
                document.getElementById('loginStatus').textContent = 'Login successful';
                
                setTimeout(() => {
                  window.location.href = 'Admin_Dashboard.html';
                }, 2000);
              }else {
                document.getElementById('loginStatus').textContent = 'Invalid Unique Code';
              }
            } else if (selectedOption === 'Parents List') {
              data = {
                'email': email,
                'admin_UniqueCode': unique, 
                'name': userData.parent_Name
              };
              localStorage.setItem('myData', JSON.stringify(data));
              document.getElementById('loginStatus').textContent = 'Login successful';
              setTimeout(() => {
                window.location.href = 'Parents_Dashboard.html';
              }, 2000);

            } else if (selectedOption === 'Teachers List') {
              data = {
                'email': email,
                'admin_UniqueCode': unique,
                'name': userData.teacher_Name
              };
              localStorage.setItem('myData', JSON.stringify(data));
              document.getElementById('loginStatus').textContent = 'Login successful';
              setTimeout(() => {
                window.location.href = 'Teacher_Dashboard.html';
              }, 2000);
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error retrieving user:', error);
        document.getElementById('loginStatus').textContent = 'Error during login. Please try again.';
      });
    }
  });
                                                                               //-----------------------------------
const formOpenBtn = document.querySelector("#form-open"),                                       //initiasing all elements
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");
  adminbtn=document.querySelector('#admin');
  teacherbtn=document.querySelector('#teacherbtn');
  parentbtn=document.querySelector('#parentbtn');
  scrtbtn=document.querySelector("#secrtbtn");
formOpenBtn.addEventListener("click", () => 
  {
    home.classList.add("show")
    if(!Condition){
      document.getElementById('secrt').textContent='';
      console.log('');
      return;
    }else{
      console.log(adminc);
      document.getElementById('secrt').textContent=adminc;
      return;
    } 
  }
);
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
  
});

//generate unique code with random keyword
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function generateRandomCode() {
  const part1 = generateRandomString(4);
  const part2 = generateRandomString(4);
  const part3 = generateRandomString(4);
  return `${part1}-${part2}-${part3}`;
}

function touch(){
  const section1 = document.getElementById('about');
  section1.style.display = (section1.style.display === 'none') ? 'block' : 'none';
}

function checkonline(){
  if (!navigator.onLine) {
    alert('No internet connection. Please try again later.');
    return;
  }
}
//send admin code through Email
function sendmail(email,admin,code){
  if(email && admin){
    const form={
      email: email,
      name:admin,
      message:code
    }
    
    var emailj= emailjs.init("kHlpzHpqevQDsdHIW");
    emailj.sendForm('service_6qp5zzh', 'template_6vqd8o4', form)
      .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          alert('Email sent successfully!');
      }, function(error) {
          console.log('FAILED...', error);
          alert('Failed to send email. Please try again.');
      });
  }
}