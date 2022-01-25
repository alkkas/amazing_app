let nickname = document.getElementById('nickname_field');
let enter_nick = document.querySelector(".enter_nickname");
let userField = document.querySelector("#nickname_field");

let loginPopup = document.getElementById('login_popup');

let data = {
    studentName: "",
    answers: {}
}

window.addEventListener('load', () => {
    if (localStorage.getItem("login")) {
        loginPopup.style.display = "none";
        // document.querySelector(".main").style.display = "block";
        data.studentName = localStorage.getItem("login");
        loadQuestions();
    } else {
        return new Promise((resolve, reject) => {
            login(resolve);
        }).then((resolve) => {
            loadQuestions();
        }).catch((reject) => {
            console.log("error occured!");
        }) 
    }
});


//popup 
function login(callback) {
    let dt = localStorage.getItem('login');
    console.log(dt)
    if (dt != null) {
        callback();
        return;
    }
    loginPopup.style.display = "grid";
    enter_nick.addEventListener('click', (event) => {
        event.preventDefault();
        if (!userField.value.replace(/\s/g, "").length) {
            alert('Вы забыли ввести никнейм!');
        } else {
            data.studentName = userField.value;
            loginPopup.style.display = "none";
            // document.querySelector(".main").style.display = "block";
            localStorage.setItem("login", userField.value);
            callback();
        }
    })
}

//add quiz item
function AddQuiz(obj, node) {
    let count = 1;
    document.querySelector(".quiz_title").innerHTML = obj.title;
    for (let item of obj.quiz) {
        node.innerHTML += 
        `<div class="quiz_item" q="q${count}">
            <h2 class="quiz_item_title">
                <span class="quiz_item_num">${count}</span>: ${item.question}
            </h2>
            <div class="quiz_field number-${count}"></div>
        </div>`;
        for (let answer of item.answers) {
            node.querySelector(`.number-${count}`).innerHTML += `<button class="quiz_answer" q="${answer}">${answer}</button>`
        }
        count++;
    }
    //now add listener to all answer buttons
    let answers = document.querySelectorAll(".quiz_field");
    answers.forEach((item) => {
        item.addEventListener("click", (event) => {
            if (event.target.className == "quiz_answer") {
                item.querySelectorAll(".quiz_answer").forEach((elem) => {
                    elem.classList.remove("active");
                })
                event.target.classList.add("active");
                data.answers[event.target.closest(".quiz_item").getAttribute("q")] =
                event.target.innerHTML;
            }
            // console.log(data);
        })
    })
}

function loadQuestions() {
    //server available -> fetch Promise instead of ordinary Promise 
    return new Promise((resolve, reject) => {
        //RECEIVE DATA FROM SERVER
        let resp = JSON.stringify({'type': 'readFromDB'});
        let req = new XMLHttpRequest();
        req.open("POST", window.location.href, true);
        req.send(resp);
        req.onload = () => {
            if (req.readyState === 4 && req.status === 200) {
                let data = JSON.parse(req.response);
                console.log(data);
                document.querySelector(".main").style.display = "block";
                return resolve(data);
            }
        }
    }).then((resolve) => {
        const field = document.querySelector(".quiz_items");
        console.log("adding questions");
        AddQuiz(resolve, field); //now add quiz field to the page
    }).catch((err) => {
        console.log("data wasn't reveived!!!")
    })
}

//send 
const sendBtn = document.querySelector(".quiz_send");
sendBtn.addEventListener("click", (event) => {
    if (Object.keys(data.answers).length == document.querySelectorAll(".quiz_item").length) {
        // fetch function to send data to server
        // sort answers
        const ordered = Object.keys(data.answers).sort().reduce(
            (obj, key) => { 
              obj[key] = data.answers[key]; 
              return obj;
            }, 
            {}
          );
        data.answers = ordered;
        console.log(data);
        let resp = JSON.stringify({'type': 'writeToDB', data});
        let req = new XMLHttpRequest();
        req.open("POST", window.location.href, true);
        req.send(resp);
        req.onload = () => {
            if (req.readyState === 4 && req.status === 200) {
                let resp1 = JSON.parse(req.response);
                console.log(resp1);
            }
        }
        console.log('success');
        alert('Спасибо, ваш ответ записан!');
        logout();
    } else {
        console.log("denied");
        alert('Вы ответили не на все вопросы!')
    }
});

function logout() {
    localStorage.removeItem('login');
    // location.reload();
    setTimeout( ()=> {
        document.location.href = '/';
    }, 1000);
    
}