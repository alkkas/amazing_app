//global variables
const enterPageBlock  = document.querySelector(".login_popup");
enterPageBlock.style.display = "none";



function showQuizes(node, arr) {
    console.log(arr)
    for (let item of arr) {
        if (item) {
            node.innerHTML += `
            <div class="task_item" index="${arr.indexOf(item)}">
                <h2 class="task_title">${item}</h2>
                <div class="task_item_flex">
                    <div class="task_statistics task-tool"><img src="/static/statistics.png" alt="statistic"></div>
                    <div class="task_edit task-tool"><img src="/static/pencil.png" alt="pencil"></div>
                    <div class="task_qr task-tool"><img src="/static/qr-code.png" alt="create qr code"></div>
                </div>
            </div>
            `
        }

    }
    ListenBtns()
}

function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
}
function enableScroll() {
    window.onscroll = function() {};
}
function ListenBtns() {
    //qr коды 
    const qrCodeWrapper = document.querySelector(".qr_code_popup_wrapper");
    document.querySelectorAll(".task_qr").forEach((i) => {
        i.addEventListener("click", (item) => {
            let currentUser = parseUser().quizes[i.closest(".task_item").getAttribute("index")];
            qrCodeWrapper.classList.add("active");
            document.querySelector(".qr_code_popup_title").innerHTML = currentUser.title
            disableScroll();
        })
    })
    document.querySelector(".qr_code_popup_close").addEventListener("click", () => {
        qrCodeWrapper.classList.remove("active");
        enableScroll()
    })
}

function parseUser() {
    return JSON.parse(localStorage.getItem("user"))
}

function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
}



function login(resolve, reject) {
    const enter = document.querySelector(".enter");
    const userName = document.querySelector("#nickname_field");
    const userPassword = document.querySelector("#password_field");
    enter.addEventListener("click", (event) => {
        event.preventDefault();
        if (userName.value.replace(/\s/g, "").length && userPassword.value.replace(/\s/g, "").length) {
            // here I will send data to server to check pswrd and name
            // Here I  will request user obj if all fileds were filed correctly 
            // but for now I assume that everything went good
            setTimeout(() => {
                enterPageBlock.style.display = "none";
                //я загрузил квизы, на данный момент будем считатать, что я это сдела
                // а пока будет просто объект которой я нарисую через функцию
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
                        },
                        {
                            title: "Почему бебра сладкая",
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
                        },
                        {
                            title: "Еще одно название",
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
                localStorage.setItem("user", JSON.stringify(user));
                resolve(user);
            }, 0);
        } else {
            alert("Неправильно!")
        }
    })
}

window.addEventListener("load", () => {
    return new Promise((resolve, reject) => {
        if(!JSON.parse(localStorage.getItem("user")) && 
        !JSON.parse(localStorage.getItem("user"))) {
            enterPageBlock.style.display = "grid";
            login(resolve, reject);
        } else {
            enterPageBlock.style.display = "none";
            resolve(parseUser());
        }
    })
    .then((user) => {
        return showQuizes(document.querySelector(".tasks"), user.quizes.map(i => i.title))
    }).catch((err) => {
        console.log("Login error")
    })
})

//создать опрос, занести его в бд и отправить на сервер
//СЛАВА Я ПИШУ ПО РУССКИ Я ЛЮБЛЮ НЮХАТЬ БЕБРУ

const createTaskField = document.querySelector(".create_task_title");
const createTaskBtn = document.querySelector(".create_task");

createTaskBtn.addEventListener("click", (event) => {
    if (createTaskField.value.replace(/\s/g, "").length) {
        let user = parseUser();
        user.quizes.push({
            title: createTaskField.value
        })
        let arr = [];
        arr[user.quizes.length - 1] = user.quizes[user.quizes.length - 1].title;
        setUser(user);
        showQuizes(document.querySelector(".tasks"), arr);
        createTaskField.value = "";
        //тут я отправлю вам ребята новый объект на сервер
    }
})


//а тут я уже буду делать проверку на кр коды погнали
