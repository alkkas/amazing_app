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
//слушаю кнопочки каждый раз когда добавляю новые штуки, штобы залетали братки в массив 
function ListenBtns() {
    document.querySelectorAll(".popup_close").forEach(i => {
        i.addEventListener("click", () => {
            qrCodeWrapper.classList.remove("active");
            editWrapper.classList.remove("active");
            enableScroll()
            document.body.style.overflow = "auto"
        })
    })

    //qr коды 
    const qrCodeWrapper = document.querySelector(".qr_code_popup_wrapper");
    document.querySelectorAll(".task_qr").forEach((i) => {
        i.addEventListener("click", (item) => {
            // при нажатии я проверю есть ли кр код, если нет то нужно сделать функцию для его созданя
            // и кнопку еще для этого, пока не сделал
            let currentUser = parseUser().quizes[i.closest(".task_item").getAttribute("index")];
            currentUser.qrcode ? console.log("qrcode exist") : console.log("You need to create qr code");
            qrCodeWrapper.classList.add("active");
            document.querySelector(".qr_code_popup_title").innerHTML = currentUser.title
            disableScroll();
        })
    })
    //редактор опросников 
    //ЭТО ПИЗДЕЦ 
    const editWrapper = document.querySelector(".edit_pop_up");
    document.querySelectorAll(".task_edit").forEach(i => {
        i.addEventListener("click", event => {
            let currentQuiz = parseUser().quizes[i.closest(".task_item").getAttribute("index")];
            editWrapper.classList.add("active");
            document.querySelector(".edit_pop_up_title").innerHTML = currentQuiz.title;
            document.body.style.overflow = "hidden";
            disableScroll();
            //нарисовать все с редактор
            let user = parseUser();
            let editFields = document.querySelector(".edit_pop_up_items");
            editFields.innerHTML = "";
            console.log(currentQuiz)
            if (currentQuiz?.quiz) {
                let count = 0;
                for (let i of currentQuiz.quiz) {
                    editFields.innerHTML += `
                    <div class="edit_pop_up_item"> 
                        <div class="edit_pop_up_question_wrapper">
                            <input type="text" class="edit_pop_up_question" placeholder="Введите вопрос" value="${i.question}">
                            <img src="../static/trash.png" alt="delete" class="edit_pop_up_delete edit_question_delete">
                        </div>
                        <div class="edit_pop_up_q_fields quiz-${count}"></div>
                        <div class="edit_pop_up_input_wrapper">
                            <button class="add_field edit_pop_up_field " placeholder="введите ответ...">Добавить ответ
                            <img src="static/close.png" alt="add answer" class="add_field_btn">
                        </div>
                    </div>`
                    for (elem of i.answers) {
                        editFields.querySelector(`.quiz-${count}`).innerHTML += `
                        <div class="edit_pop_up_input_wrapper">
                            <input type="text" class="edit_pop_up_field" placeholder="введите ответ..." value="${elem}">
                            <img src="../static/trash.png" alt="delete" class="edit_pop_up_delete edit_answer_delete">
                        </div>
                        `
                    }
                    count++;
                }
            }
            // теперь повесить обработчиеки на удаление 

            function delListener() {
                let delAnswer = document.querySelectorAll(".edit_answer_delete");
                let delQuest = document.querySelectorAll(".edit_question_delete");
                delAnswer.forEach(i => {
                    i.addEventListener("click", event => {
                        i.closest(".edit_pop_up_input_wrapper").remove()
                    })
                })
                                
                delQuest.forEach(i => {
                    i.addEventListener("click", event => {
                        i.closest(".edit_pop_up_item").remove()
                    })
                })
            }

            delListener()


            // и обработчики на добавление новых вопросов
            function addListener() {
                let addAnswer = document.querySelectorAll(".add_field");
                addAnswer.forEach(i => {
                    i.addEventListener("click", event => {
                        i.closest(".edit_pop_up_item").querySelector(".edit_pop_up_q_fields").innerHTML += `
                        <div class="edit_pop_up_input_wrapper">
                            <input type="text" class="edit_pop_up_field" placeholder="введите ответ..." value="">
                            <img src="../static/trash.png" alt="delete" class="edit_pop_up_delete edit_answer_delete">
                        </div>
                        `
                        delListener()
                    })
                })
            }
            addListener();


            let addQuestion = document.querySelector(".add_question");
            addQuestion.addEventListener("click", (event) => {
                console.log("clicked")
                editFields.innerHTML += `
                    <div class="edit_pop_up_item"> 
                    <div class="edit_pop_up_question_wrapper">
                        <input type="text" class="edit_pop_up_question" placeholder="Введите вопрос">
                        <img src="../static/trash.png" alt="delete" class="edit_pop_up_delete edit_question_delete">
                    </div>
                    <div class="edit_pop_up_q_fields"></div>
                    <div class="edit_pop_up_input_wrapper">
                        <button class="add_field edit_pop_up_field " placeholder="введите ответ...">Добавить ответ
                        <img src="static/close.png" alt="add answer" class="add_field_btn">
                    </div>
                </div>
                    `
                delListener();
                addListener();
            })
        })
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
