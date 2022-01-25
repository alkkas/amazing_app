// global variables
const enterPageBlock  = document.querySelector(".login_popup");
const mainPartBlock = document.querySelector(".main");
const hello_label = document.querySelector(".hello");

enterPageBlock.style.display = "none";
mainPartBlock.style.display = "none";

function logout_click() {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    // location.reload();
    window.location.href = '/';
}

function send_to_server(url, data) {
    for (let el in data['quizes']) {
        delete data['quizes'][el].qrcode;
        delete data['quizes'][el].sixdigitcode;
    } // удаляю инфу по квизу, тк она уже есть в бд

    d = {'type': 'quizies', 'name': data.name, 'data': data}

    let req = new XMLHttpRequest();
    req.open("POST", url, true);
    console.log(JSON.stringify(d))
    req.send(JSON.stringify(d));
    req.onload = () => {
        if (req.readyState === 4 && req.status === 200) {
            console.log('succsess request')
        }
    }
}

function startQuiz(username, quizname) {
    // let user = parseUser();
    // for (let el in user.quizes) {
    //     if (user.quizes[el].title === quizname) {
    //         console.log(user.quizes[el].qrcode)
    //         if (user.quizes[el].qrcode == 'in_develop' || user.quizes[el].qrcode != undefined) {
    //             console.log('done');
    //             return;
    //         } else {
    //             user.quizes[el].qrcode = 'in_develop';
    //         }
            
    //     }
    // }
    // setUser(user);
    d = {'type': 'startQuiz', 'username': username, 'quizname': quizname}
    let req = new XMLHttpRequest();
    req.open("POST", '/avenue', true);
    req.send(JSON.stringify(d));
    req.onload = () => {
        if (req.readyState === 4 && req.status === 200) {
            let dataFromServer = JSON.parse(req.response);
            console.log([dataFromServer.sixdigitcode, dataFromServer.pathtoimg])

            let user = parseUser();
            for (let el in user.quizes) {
                if (user.quizes[el].title === quizname) {
                    console.log(user.quizes[el])
                    user.quizes[el].qrcode = dataFromServer.pathtoimg;
                    user.quizes[el].sixdigitcode = dataFromServer.sixdigitcode;
                    document.querySelector('.sixdigitcode_span').innerHTML = dataFromServer.sixdigitcode;
                    document.querySelector('.qr_code_popup_img').src = dataFromServer.pathtoimg;
                }
            }
            setUser(user);
        }
    }
}
function endQuiz(username, quizname) {
    let user = parseUser();
    for (let el in user.quizes) {
        if (user.quizes[el].title === quizname) {
            console.log(user.quizes[el])
            delete user.quizes[el].qrcode;
            delete user.quizes[el].sixdigitcode;
        }
    }
    setUser(user);

    d = {'type': 'endQuiz', 'username': username, 'quizname': quizname}
    let req = new XMLHttpRequest();
    req.open("POST", '/avenue', true);
    req.send(JSON.stringify(d));
    req.onload = () => {
        if (req.readyState === 4 && req.status === 200) {
            let dataFromServer = JSON.parse(req.response);
        }
    }

    
}

function showQuizes(node, arr) {
    // console.log(arr)
    for (let item of arr) {
        if (item) {
            node.innerHTML += `
            <div class="task_item" index="${arr.indexOf(item)}">
                <h2 class="task_title">${item}</h2>
                <div class="task_item_flex">
                    <div class="task_statistics task-tool">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
                            <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                        </svg>
                    </div>
                    <div class="task_edit task-tool">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </div>
                    <div class="task_qr task-tool">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-grid" viewBox="0 0 16 16">
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                        </svg>
                    </div>


                    <!--<div class="task_statistics task-tool"><img src="/static/images/statistics.png" alt="statistic"></div>
                    <div class="task_edit task-tool"><img src="/static/images/pencil.png" alt="pencil"></div>
                    <div class="task_qr task-tool"><img src="/static/images/qr-code.png" alt="create qr code"></div>-->
                </div>
            </div>
            `
        }
    }
    ListenBtns()
}

let supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            // window.scrollTo(scrollLeft, scrollTop);
        };
        // window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
}
function enableScroll() {
    window.onscroll = function() {};
    // window.removeEventListener('touchmove', preventDefault, wheelOpt);
}

function isNewQuizNone(title) {
    let data = parseUser();
    for (let i in data.quizes) {
        if (data.quizes[i].title == title) {
            if (data.quizes[i].quiz.length == 0) return true;
            for (let j in data.quizes[i].quiz){
                if ( data.quizes[i].quiz[j].answers.length == 0) return true;
            }
        }
    }
    return false;
}

let st_btn = document.querySelector('.st_quiz_btn');
let nd_btn = document.querySelector('.nd_quiz_btn');
// завершение квиза
nd_btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    let currentTitle = document.querySelector('.qr_code_popup_title').innerHTML;
    console.log('endQuiz');
    document.querySelector('.qr_data').style = 'display: none';
    st_btn.style = 'display: block';
    nd_btn.style = 'display: none';
    endQuiz(localStorage.getItem('username'), currentTitle);
});
// старт квиза
st_btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    let currentTitle = document.querySelector('.qr_code_popup_title').innerHTML;

    if (isNewQuizNone(currentTitle)==true) {
        alert('Вы не можете начать опрос, если прописаны не все ответы!');
        return;
    }
    console.log(isNewQuizNone(currentTitle))
    console.log('startQuiz');
    startQuiz(localStorage.getItem('username'), currentTitle);
    document.querySelector('.qr_data').style = 'display: block';
    st_btn.style = 'display: none';
    nd_btn.style = 'display: block';
});

//слушаю кнопочки каждый раз когда добавляю новые штуки, штобы залетали братки в массив
function ListenBtns() {
    document.querySelectorAll(".popup_close").forEach(i => {
        i.addEventListener("click", () => {
            qrCodeWrapper.classList.remove("active");
            editWrapper.classList.remove("active");
            statistic.classList.remove("active")
            enableScroll();
            document.querySelector(".add_question").replaceWith(document.querySelector(".add_question").cloneNode(true));
            document.querySelector(".edit_pop_up_save").replaceWith(document.querySelector(".edit_pop_up_save").cloneNode(true));
            document.body.style.overflow = "auto";
        })
    })


    //qr коды 
    const qrCodeWrapper = document.querySelector(".qr_code_popup_wrapper");
    document.querySelectorAll(".task_qr").forEach((i) => {
        i.addEventListener("click", (item) => {
            // disableScroll();
            let currentUser = parseUser().quizes[i.closest(".task_item").getAttribute("index")];

            if (currentUser.qrcode) {
                console.log("qrcode exist");
                document.querySelector('.qr_data').style = 'display: block';
                st_btn.style = 'display: none';
                nd_btn.style = 'display: block';
            } else {
                // старт квиза
                st_btn.style = 'display: block';
                nd_btn.style = 'display: none';
                document.querySelector('.qr_data').style = 'display: none';
            }
            qrCodeWrapper.classList.add("active");
            document.querySelector(".qr_code_popup_title").innerHTML = currentUser.title;
            document.querySelector('.sixdigitcode_span').innerHTML = currentUser.sixdigitcode;
            if (currentUser.qrcode)
                document.querySelector('.qr_code_popup_img').src = currentUser.qrcode;
            else document.querySelector('.qr_code_popup_img').src = '#';
            
            disableScroll();
        });
    });

    //редактор опросников 
    //ЭТО ПИЗДЕЦ
    const editWrapper = document.querySelector(".edit_pop_up");
    document.querySelectorAll(".task_edit").forEach(i => {
        i.addEventListener("click", event => {
            let currentQuiz = parseUser().quizes[i.closest(".task_item").getAttribute("index")];
            editWrapper.classList.add("active");
            document.querySelector(".edit_pop_up_title").innerHTML = currentQuiz.title;
            document.querySelector(".edit_pop_up_title").setAttribute("index", i.closest(".task_item").getAttribute("index"))

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
                            <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_question_delete">
                        </div>
                        <div class="edit_pop_up_q_fields quiz-${count}"></div>
                        <div class="edit_pop_up_input_wrapper">
                            <button class="add_field edit_pop_up_field " placeholder="введите ответ...">Добавить ответ
                            <img src="/static/images/close.png" alt="add answer" class="add_field_btn">
                        </div>
                    </div>`
                    for (elem of i.answers) {
                        editFields.querySelector(`.quiz-${count}`).innerHTML += `
                        <div class="edit_pop_up_input_wrapper">
                            <input type="text" class="edit_pop_up_field" placeholder="введите ответ..." value="${elem}">
                            <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_answer_delete">
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

            // так как я хз как это сделать и дом постоянно обновляется
            // то я просто повесил обработчики на постоянную запись
            function checkForUpdate() {
                document.querySelectorAll(".edit_pop_up_field").forEach(item => {
                    setInterval(() => {
                        item.setAttribute("value", item.value);
                    }, 200)
                })
                document.querySelectorAll(".edit_pop_up_question").forEach(item => {
                    setInterval(() => {
                        item.setAttribute("value", item.value);
                    }, 200)
                })
            }
 
            // и обработчики на добавление новых вопросов
            function addListener() {
                let addAnswer = document.querySelectorAll(".add_field");
                addAnswer.forEach(i => {
                    i.addEventListener("click", event => {
                        console.log("clicked");
                        i.closest(".edit_pop_up_item").querySelector(".edit_pop_up_q_fields").innerHTML += `
                        <div class="edit_pop_up_input_wrapper">
                            <input type="text" class="edit_pop_up_field" placeholder="введите ответ...">
                            <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_answer_delete" value="">
                        </div>
                        `
                        checkForUpdate();
                        delListener();
                    })
                })
            }
            let addQuestion = document.querySelector(".add_question");
            addQuestion.addEventListener("click", (event) => {
                console.log("clicked")
                editFields.innerHTML += `
                    <div class="edit_pop_up_item"> 
                    <div class="edit_pop_up_question_wrapper">
                        <input type="text" class="edit_pop_up_question" placeholder="Введите вопрос">
                        <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_question_delete">
                    </div>
                    <div class="edit_pop_up_q_fields"></div>
                    <div class="edit_pop_up_input_wrapper">
                        <button class="add_field edit_pop_up_field " placeholder="введите ответ...">Добавить ответ
                        <img src="/static/images/close.png" alt="add answer" class="add_field_btn">
                    </div>
                </div>`
                checkForUpdate();
                delListener();
                addListener();
            })
            delListener();
            addListener();


            //теперь надо сохранить в user все изменения 
            let save = document.querySelector(".edit_pop_up_save");
            save.addEventListener("click", () => {

                console.log();
                let user = parseUser();
                let userQuiz = user.quizes[document.querySelector(".edit_pop_up_title").getAttribute("index")].quiz;
                userQuiz = [];
                let count  = 0;
                document.querySelectorAll(".edit_pop_up_item").forEach(item => {
                    userQuiz.push( 
                        {
                            question: item.querySelector(".edit_pop_up_question").value,
                            answers: []
                        }
                    )
                    let valuesCount = 0;
                    let values  = Array.from(item.querySelectorAll("input.edit_pop_up_field"));
                    values = values.map(item => item.value)
                    values.every((elem, index) => {
                        console.log(values.indexOf(elem))
                        if (values.indexOf(elem) != index) {
                        alert("У вас есть одинаковые ответы, перепроверьте");
                        return false;
                        }
                        valuesCount++;
                        return true;
                    })
                    if (valuesCount == values.length) {
                        values.forEach(i => {
                            userQuiz[count].answers.push(i)
                        })
                    }
                    count++;
                }) 
                if (count == document.querySelectorAll(".edit_pop_up_item").length) {
                    // console.log(userQuiz);
                    user.quizes[document.querySelector(".edit_pop_up_title").getAttribute("index")].quiz = userQuiz;
                    setUser(user);

                    console.log('--fuck you nigga--');
                    console.log(user);

                    // и тут я отправлю вам ребята файл с юзером
                    send_to_server('/avenue', user);
                    location.reload(); // чтоб не баговало
                    // alert("Сохранено!");
                }

            })
            //а теперь пора все удалить
            let del = document.querySelector(".edit_pop_up_del")
            del.addEventListener("click", () => {
                let index = document.querySelector(".edit_pop_up_title").getAttribute("index");
                document.querySelectorAll(`.task_item`).forEach(item => {
                    if (item.getAttribute("index") == index) {
                        item.remove()
                    }
                })
                let user = parseUser();
                user.quizes.splice(index, 1);
                setUser(user);

                send_to_server('/avenue', user);

                editWrapper.classList.remove("active");
                document.querySelector(".add_question").replaceWith(document.querySelector(".add_question").cloneNode(true));
                enableScroll();
                document.body.style.overflow = "auto";
                location.reload();
            });
        });
    });


    //таблица с результатами
    const statistic = document.querySelector(".statistic_wrapper");
    document.querySelectorAll(".task_statistics").forEach(i => {
        i.addEventListener("click", elem => {
            // подгружаю статистику
            let quiz = parseUser().quizes[i.closest(".task_item").getAttribute("index")];
            


            // getStatistic(localStorage.getItem('username'), quiz.title);
            d = {'type': 'getStatistics', 'username': localStorage.getItem('username'), 'quiz_name': quiz.title}

            let req = new XMLHttpRequest();
            req.open("POST", '/avenue', true);
            console.log(JSON.stringify(d))
            req.send(JSON.stringify(d));
            req.onload = () => {
                if (req.readyState === 4 && req.status === 200) {
                    let dataFromServer = JSON.parse(req.response);
                    let students = dataFromServer['statistics_data'];
                    if (students == 'None') {
                        alert("Нет информации по опросу!");
                        return;
                    }
                    let students_arr = []
                    console.log(students);
                    students.forEach((item, i, students) => {
                        students_arr.push(JSON.parse(students[i].value));
                        console.log(students[i].value);
                    });
                    console.log(students_arr);

                    

                    statistic.classList.add('active');
                    document.body.style.overflow = "hidden";
                    document.querySelector(".statistic_title").innerHTML = quiz.title;

                    let field = document.querySelector(".table_content");
                    let header = document.querySelector(".statistic_headers");
                    field.innerHTML = "";
                    header.innerHTML = "<th>Имя</th>";
                    for(let i of quiz.quiz) {
                        header.innerHTML += `
                        <th class="table_question_title">${i.question}</th>
                        `
                    }
                    for (let i of students_arr) {
                        let content = "";
                        let name = "";
                        
                        name = `<th>${i.studentName}</th>`
                        for (let elem of Object.values(i.answers)) {
                            content  += `<td>${elem}</td>`;
                        }
                        field.innerHTML += `<tr >
                        ${name + content}
                        </tr >
                        `;
                    }
                    console.log(students_arr);
                    let ans_obj = getPopularAnswers(students_arr);
                    console.log(ans_obj)
                    let popular = document.querySelector(".charts_data");
                    popular.innerHTML = '';
                    let c = 0;
                    for(let i of quiz.quiz) {
                        popular.innerHTML += `
                        <p class="p_charts">${i.question} - <span class="ans_item_span">${ans_obj[c].item}</span></p>
                        `
                        c++;
                    }
                    let currentTitle = document.querySelector('.statistic_title').innerHTML;
                    console.log(currentTitle, '------')
                }
            }
            
        });
    });
}

function getPopularAnswers(arr) {
    // очень сложная функция
    let aa = []
    let a = []
    // создаю массивы значений
    arr.forEach((item, i, arr) => {
        a.push(Object.values(item.answers));
    });
    // console.log(a);
    // создаю массивы одинаковых значений
    for(let i=0;i<a.length;i++) {
        let tmp = [];
        a.forEach((item, ix, a) => {
            tmp.push(item[i])
        });
        if ( tmp.every( (val, iy, tmp) => val === undefined ) ) break;
        aa.push(tmp);
    }
    // console.log(aa);
    // нахожу популярные значения
    let bb = []
    aa.forEach((myitem, i, aa) => {
        const maxOccurences = myitem => Array.from(
            myitem.reduce(
            (map, value) => map.set(
            value,
            map.has(value)
                ? map.get(value) + 1
                : 1
            ),
            new Map()
        ).entries()
        ).reduce(
        (max, entry) => entry[1] > max[1] ? entry : max
        ).reduce(
        (item, count) => ({ item, count })
        );
        bb.push(maxOccurences(myitem));
    });
    // console.log(bb);
    return bb;
}

function parseUser() {
    return JSON.parse(localStorage.getItem("user"))
}

function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
}



function login(resolve, reject) {
    const enter = document.querySelector(".enter_nickname");
    const userName = document.querySelector("#nickname_field");
    const userPassword = document.querySelector("#password_field");
    enter.addEventListener("click", (event) => {
        event.preventDefault();
        if (userName.value.replace(/\s/g, "").length && userPassword.value.replace(/\s/g, "").length) {
            // here I will send data to server to check pswrd and name
            // Here I  will request user obj if all fileds were filed correctly 
            // but for now I assume that everything went good
            // [xmllln]: done
            let data = JSON.stringify({"type": "check_log", "username": userName.value.toLowerCase(), "password": userPassword.value });
            let req = new XMLHttpRequest();
            req.open("POST", '/avenue', true);
            req.send(data);
            req.onload = () => {
                if (req.readyState === 4 && req.status === 200) {
                    let ch_exist = JSON.parse(req.response);

                    if (ch_exist['is_exist'] == true) {
                        console.log('done login');
                        localStorage.setItem("username", userName.value.toLowerCase());
                        enterPageBlock.style.display = "none";
                        mainPartBlock.style.display = "block";
                        
                        // console.log(ch_exist['data']);
                        let data_from_db = JSON.parse(ch_exist['data']);
                        // вот эта штука короче нужна, для появления активных квизов при заходе с другого устройства
                        console.log(data_from_db);
                        if (ch_exist['quizzes_data'] != 'None') {
                            let putQuiz = ch_exist['quizzes_data'];
                            console.log(putQuiz)
                            for (let dbi in data_from_db['quizes']) {
                                let q_title = data_from_db['quizes'][dbi].title;
                                
                                for (let el in putQuiz) {
                                    console.log(q_title, putQuiz[el].quizname)
                                    if (q_title == putQuiz[el].quizname) {
                                        data_from_db['quizes'][dbi].qrcode = putQuiz[el].link_to_qr;
                                        data_from_db['quizes'][dbi].sixdigitcode = putQuiz[el].six_digit_code;
                                    }
                                }
                            }
                        }
                        console.log(data_from_db);
                        setUser(data_from_db);
                        resolve(data_from_db);
                    } else {
                        alert("Неверный логин или пароль!");
                        return;
                    }
                }
            }
            hello_label.textContent = `Здравствуйте, ${localStorage.getItem("username")} !`;
        } else {
            alert("Некорректный ввод!");
        }
    })
}

window.addEventListener("load", () => {
    // hello_label.textContent = `Здравствуйте, ${localStorage.getItem("username")} !`;
    return new Promise((resolve, reject) => {
        if(!JSON.parse(localStorage.getItem("user")) && 
        !JSON.parse(localStorage.getItem("user"))) {
            enterPageBlock.style.display = "grid";
            login(resolve, reject);
        } else {
            enterPageBlock.style.display = "none";
            mainPartBlock.style.display = "block";
            resolve(parseUser());
        }
    })
    .then((user) => {
        enterPageBlock.style.display = "none";
        hello_label.textContent = `Здравствуйте, ${localStorage.getItem("username")} !`;
        return showQuizes(document.querySelector(".tasks"), user.quizes.map(i => i.title))
    }).catch((err) => {
        console.log("Login error", err);
    })
})

//создать опрос, занести его в бд и отправить на сервер
//СЛАВА Я ПИШУ ПО РУССКИ Я ЛЮБЛЮ НЮХАТЬ БЕБРУ
// чел, ты лучший

const createTaskField = document.querySelector(".create_task_title");
const createTaskBtn = document.querySelector(".create_task");

createTaskBtn.addEventListener("click", (event) => {
    if (createTaskField.value.replace(/\s/g, "").length) {
        let user = parseUser();
        for (let el in user.quizes) {
            if (user.quizes[el].title === createTaskField.value) {
                alert('Опрос с таким названием уже существует.');
                return;
            }
        }
        
        user.quizes.push({
            title: createTaskField.value
        })
        let arr = [];
        arr[user.quizes.length - 1] = user.quizes[user.quizes.length - 1].title;
        setUser(user);
        showQuizes(document.querySelector(".tasks"), arr);
        createTaskField.value = "";
        //тут я отправлю вам ребята новый объект на сервер
        send_to_server('/avenue', parseUser());
    }
})

//а тут я уже буду делать проверку на кр коды погнали
// сделал где-то сверху [by xamelllion]