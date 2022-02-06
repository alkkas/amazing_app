const nickname = document.getElementById('nickname_field');
let name = document.querySelector(".enter_nickname");
let userField = document.querySelector("#nickname_field");
let data = {
    studentName: "",
    answers: {

    }
}


window.addEventListener('load', () => {
    if (localStorage.getItem("login")) {
        document.querySelector(".login_popup").style.display = "none";
        data.studentName = localStorage.getItem("login");
        loadQuestions();
    } else {
        return new Promise((resolve, reject) => {
            login(resolve);
        }).then((resolve) => {
            loadQuestions();
        }).catch((reject) => {
            console.log("error occured!")
        }) 
    }
});
//questions received from 
const questions = {
    title: "Amazing quiz",
    quiz: [
        {
            question: "What's the largest planet in solar system?",
            answers: [
                "variant 1",
                "variant 2",
            ]
        },
        {
            question: "Why Mars has red color?",
            answers: [
                "variant 1",
                "variant 2",
                "variant 3",
                "variant 2",
                "variant 3"
            ]
        },
        {
            question: "Почему бебра сладкая???",
            answers: [
                "variant 1",
                "variant 2",
                "variant 3"
            ]
        },
        {
            question: "What's the largest planet in solar system?",
            answers: [
                "variant 1",
                "variant 2",
            ]
        },
        {
            question: "What's the largest planet in solar system?",
            answers: [
                "variant 1",
                "variant 2",
            ]
        },
    ]
}
//popup 
function login(callback) {
    document.querySelector(".login_popup").style.display = "grid";
    name.addEventListener('click', (event) => {
        if (!userField.value.replace(/\s/g, "").length) {
            alert('Введите имя пользователя!');
        } else {
            data.studentName = userField.value;
            document.querySelector(".login_popup").style.display = "none";
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
                event.target.classList.add("active")
                data.answers[event.target.closest(".quiz_item").getAttribute("q")] =
                event.target.innerHTML;
            }
            console.log(data)
        })
    })
}
function loadQuestions() {
    //server available -> fetch Promise instead of ordinary Promise 
    return new Promise((resolve, reject) => {
        //RECEIVE DATA FROM SERVER
        setTimeout(() => {
            return resolve(questions)
        }, 2000)
    }).then((resolve) => {
        const field = document.querySelector(".quiz_items");
        console.log("adding questions");
        //now add quiz field to the page
        AddQuiz(resolve, field);
    }).catch((err) => {
        console.log("data wasn't reveived!!!")
    })
}

//send 
const sendBtn = document.querySelector(".quiz_send");
sendBtn.addEventListener("click", (event) => {
    if (Object.keys(data.answers).length == document.querySelectorAll(".quiz_item").length) {
        //fetch function to send data to server
        console.log('success')
    } else {
        //maybe show popUp that you haven't entered answers 
        console.log("denied")
    }
})