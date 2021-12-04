//global variables
const enterPageBlock  = document.querySelector(".login_popup");
enterPageBlock.style.display = "none";
document.querySelector(".qr_code_popup_wrapper").style.display = "none"
console.log("some changes!!!");

//load quizes 
function loadQuizes() {
    return new Promise((resolve, reject) => {
                let quizes = [
            {
                title: "Why Mars is red colored?",
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
            },
            {
                title: "Почему так важно нюхать бебру?",
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
            },
            {
                title: "Ну и еще какое-то название",
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
        ]
        //fetch function
       setTimeout(() => {
        resolve(quizes);
       }, 0); 
    })

}
function showQuizes(node, obj) {
    for (let item of obj) {
        node.innerHTML += `
        <div class="task_item" index="${obj.indexOf(item)}">
            <h2 class="task_title">${item.title}</h2>
            <div class="task_item_flex">
                <div class="task_statistics task-tool"><img src="/static/statistics.png" alt="statistic"></div>
                <div class="task_edit task-tool"><img src="/static/pencil.png" alt="pencil"></div>
                <div class="task_qr task-tool"><img src="/static/qr-code.png" alt="create qr code"></div>
            </div>
        </div>
        `
    }
}
function login(resolve, reject) {
    const enter = document.querySelector(".enter");
    const userName = document.querySelector("#nickname_field");
    const userPassword = document.querySelector("#password_field");
    enter.addEventListener("click", (event) => {
        event.preventDefault()
        if (userName.value.replace(/\s/g, "").length && userPassword.value.replace(/\s/g, "").length) {
            // here I will send data to server to check pswrd and name
            // Here I  will request user obj if all fileds were filed correctly 
            // but for now I assume that everything went good
            setTimeout(() => {
                localStorage.setItem("name", userName.value);
                localStorage.setItem("pswrd", userPassword.value);
                enterPageBlock.style.display = "none";
                let user = {
                    name: userName.value,
                    password: userPassword.value,
                    quizes: [
                        {
                            title: "Solar System",
                            qrcode: "https://link-to-the-picture.img",
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
                            ],
                            students: [ 
                                {   studentName: "abobus", 
                                    answers: {
                                        q1: "variant 1",
                                        q2: "variant 2",
                                        q3: "variant 2",
                                        q4: "variant 2",
                                    }
                                },
                                {   studentName: "abobus2", 
                                    answers: {
                                        q1: "variant 1",
                                        q2: "variant 2",
                                        q3: "variant 2",
                                        q4: "variant 2",
                                    }
                                },
                                {   studentName: "abobus3", 
                                    answers: {
                                        q1: "variant 1",
                                        q2: "variant 3",
                                        q3: "variant 4",
                                        q4: "variant 2",
                                    }
                            },
                            ]
                        }
                    ]
                }
                localStorage.setItem("user", user)
                resolve(user);
            }, 0);
        } else {
            reject()
        }
    })
}

window.addEventListener("load", () => {
    return new Promise((resolve, reject) => {
        if(!localStorage.getItem("name") && !localStorage.getItem("pswrd")) {
            enterPageBlock.style.display = "grid";
            login(resolve, reject);
        } else {
            enterPageBlock.style.display = "none";
            resolve(localStorage.getItem("user"));
        }
    })
    .then((user) => {
        console.log(user)
        return loadQuizes();
    }).then((quiz) => {
        showQuizes(document.querySelector(".tasks"), quiz)
    }).catch((err) => {
        console.log(err)
    })
})