import {
  getQuiz,
  parseUser,
  setUser,
  getQuestionTemplate,
  getAnswerTemplate,
  getEditItem,
} from "./modules.js";

function logout_click() {
  localStorage.removeItem("user");
  localStorage.removeItem("username");
  // location.reload();
  window.location.href = "/";
}
async function send_to_server(url, data) {
  console.log(data);
  //d = { type: "quizies", name: data.name, data: data };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log(response);
  return response.json();
}
function startQuiz(username, quizname) {
  d = { type: "startQuiz", username: username, quizname: quizname };

  send_to_server("/avenue", d)
    .then((data) => {
      const user = parseUser();
      const currentQuiz = user.quizes.find((e) => e.title === quizname);
      currentQuiz.qrcode = data.pathtoimg;
      currentQuiz.sixdigitcode = data.sixdigitcode;

      document.querySelector(".sixdigitcode_span").innerHTML =
        data.sixdigitcode;
      document.querySelector(".qr_code_popup_img").src = data.pathtoimg;
      setUser(user);
    })
    .catch((err) => console.log(err));
}
function endQuiz(username, quizname) {
  const user = parseUser();
  const currentQuiz = user.quizes.find((e) => e.title === quizname);
  currentQuiz.qrcode = null;
  currentQuiz.sixdigitcode = null;
  setUser(user);

  d = { type: "endQuiz", username: username, quizname: quizname };
  send_to_server("/avenue", d)
    .then((data) => console.log("success", data))
    .catch((err) => console.log(err));
}
function showQuizes(node, arr) {
  for (let item of arr) {
    if (item) {
      node.innerHTML += getQuiz(arr, item);
    }
  }
}
function disableScroll() {
  document.body.classList.add("disabled-scroll");
}
function enableScroll() {
  document.body.classList.remove("disabled-scroll");
}
function isNewQuizNone(title) {
  const data = parseUser();

  const currentQuiz = data.quizes.find((e) => e.title === title);
  console.log(currentQuiz);
  return currentQuiz.quiz?.length && currentQuiz.quiz.length !== 0
    ? false
    : true;
}
function openEditTask(currentItem, currentQuiz) {
  const title = document.querySelector(".edit_pop_up_title");

  if (currentQuiz.qrcode) {
    console.log("quize is active");
    alert("Вы не можете редактировать опрос, пока он запущен!");
    return;
  }

  editWrapper.classList.add("active");
  title.innerHTML = currentQuiz.title;
  title.setAttribute("index", currentItem.getAttribute("index"));

  disableScroll();
}
function showEditTaskFields(currentQuiz) {
  editFields.innerHTML = "";
  if (currentQuiz?.quiz) {
    for (let i of currentQuiz.quiz) {
      editFields.innerHTML += getEditItem(i, currentQuiz);

      for (let elem of i.answers) {
        editFields.querySelector(
          `.quiz-${currentQuiz.quiz.indexOf(i)}`
        ).innerHTML += getAnswerTemplate(elem);
      }
    }
  }
}
function saveTask() {
  let user = parseUser();
  let userQuiz = [];
  let validTask = true;

  document.querySelectorAll(".edit_pop_up_item").forEach((item) => {
    let questionObj = {
      question: item.querySelector(".edit_pop_up_question").value,
      answers: [],
    };

    let values = Array.from(
      item.querySelectorAll("input.edit_pop_up_field")
    ).map((item) => item.value);

    let allValuesUnique = values.every((elem, index) => {
      return values.indexOf(elem) != index ? false : true;
    });

    if (allValuesUnique) {
      questionObj.answers = values;
      userQuiz.push(questionObj);
    } else {
      validTask = false;
      alert("У вас есть одинаковые ответы, перепроверьте");
    }
  });

  if (validTask) {
    user.quizes[
      document.querySelector(".edit_pop_up_title").getAttribute("index")
    ].quiz = userQuiz;
    setUser(user);
    console.log(parseUser());
    // и тут я отправлю вам ребята файл с юзером
    d = { type: "quizies", name: user.name, data: user };
    send_to_server("/avenue", d).then((response) => {
      console.log(response);
      // editWrapper.classList.remove("active");
      // enableScroll();
    });
  }
}
function deleteTask() {
  let index = document
    .querySelector(".edit_pop_up_title")
    .getAttribute("index");

  const user = parseUser();

  user.quizes.splice(index, 1);

  document.querySelector(`.task_item[index="${index}"]`).remove();
  setUser(user);

  d = { type: "quizies", name: user.name, data: user };

  send_to_server("/avenue", d)
    .then((data) => {
      console.log(data);
      editWrapper.classList.remove("active");
      enableScroll();
    })
    .catch((err) => console.log(err));
}
function openQrCode(item) {
  let currentUser =
    parseUser().quizes[item.closest(".task_item").getAttribute("index")];

  if (currentUser.qrcode) {
    console.log("qrcode exist");
    document.querySelector(".qr_data").style = "display: block";
    st_btn.style = "display: none";
    nd_btn.style = "display: block";
  } else {
    // старт квиза
    st_btn.style = "display: block";
    nd_btn.style = "display: none";
    document.querySelector(".qr_data").style = "display: none";
  }
  qrCodeWrapper.classList.add("active");
  document.querySelector(".qr_code_popup_title").innerHTML = currentUser.title;
  document.querySelector(".sixdigitcode_span").innerHTML =
    currentUser.sixdigitcode;
  if (currentUser.qrcode)
    document.querySelector(".qr_code_popup_img").src = currentUser.qrcode;
  else document.querySelector(".qr_code_popup_img").src = "#";

  disableScroll();
}
function getPopularAnswers(arr, questions) {
  const popularAnswers = questions.map((item, i) => {
    let answers = arr
      .map((item) => Object.values(item.answers)[i])
      .reduce((acc, current) => {
        return { ...acc, [current]: (acc[current] || 0) + 1 };
      }, {});

    let popularAnswer = Object.keys(answers).reduce((acc, current) => {
      if (answers[current] >= answers[acc]) {
        return current;
      }
      return acc;
    });

    return { [item]: popularAnswer };
  });
  return popularAnswers;
}
function openStatistics(item) {
  // подгружаю статистику
  let quiz =
    parseUser().quizes[item.closest(".task_item").getAttribute("index")];

  // getStatistic(localStorage.getItem('username'), quiz.title);
  d = {
    type: "getStatistics",
    username: parseUser().name,
    quiz_name: quiz.title,
  };

  send_to_server("/avenue", d).then((data) => {
    console.log(data);

    let students = data["statistics_data"];
    if (data["statistics_data"] == "None") {
      alert("Нет информации по опросу!");
      return;
    }

    let students_arr = students.map((i) => JSON.parse(i.value));

    statistic.classList.add("active");
    disableScroll();

    document.querySelector(".statistic_title").innerHTML = quiz.title;

    let field = document.querySelector(".table_content");
    let header = document.querySelector(".statistic_headers");

    field.innerHTML = "";

    header.innerHTML = "<th>Имя</th>";
    const questions = quiz.quiz.map((item) => item.question);
    for (let i of quiz.quiz) {
      header.innerHTML += `<th class="table_question_title">${i.question}</th>`;
    }

    for (let i of students_arr) {
      let content = "";
      let name = "";

      name = `<th>${i.studentName}</th>`;
      for (let elem of Object.values(i.answers)) {
        content += `<td>${elem}</td>`;
      }
      field.innerHTML += `<tr>${name + content}</tr >`;
    }
    console.log(students_arr);
    let popularAnswers = getPopularAnswers(students_arr, questions);

    let popular = document.querySelector(".charts_data");
    popular.innerHTML = "";

    for (let i of popularAnswers) {
      popular.innerHTML += `<p class="p_charts">${Object.keys(i)[0]} - 
        <span class="ans_item_span">${Object.values(i)[0]}</span>
      </p>`;
    }

    currentTitle = document.querySelector(".statistic_title").innerHTML;
  });
}
function login() {
  const enter = document.querySelector(".enter_nickname");
  const userName = document.querySelector("#nickname_field");
  const userPassword = document.querySelector("#password_field");

  enter.addEventListener("click", async (event) => {
    event.preventDefault();
    if (
      userName.value.replace(/\s/g, "").length &&
      userPassword.value.replace(/\s/g, "").length
    ) {
      let data = {
        type: "check_log",
        username: userName.value.toLowerCase(),
        password: userPassword.value,
      };

      let ch_exist = await send_to_server("/avenue", data);

      if (ch_exist["is_exist"] == true) {
        console.log("done login");
        localStorage.setItem("username", userName.value.toLowerCase());

        enterPageBlock.style.display = "none";
        mainPartBlock.style.display = "block";

        let data_from_db = ch_exist["data"];
        setUser(JSON.parse(data_from_db));
        showContent();
      } else {
        alert("Неверный логин или пароль!");
        return;
      }
    } else {
      alert("Некорректный ввод!");
    }
  });
  return false;
}
function showContent() {
  let user = parseUser();
  enterPageBlock.style.display = "none";
  hello_label.textContent = `Здравствуйте, ${localStorage.getItem(
    "username"
  )} !`;
  showQuizes(
    document.querySelector(".tasks"),
    user.quizes.map((i) => i.title)
  );
}
// global variables
const enterPageBlock = document.querySelector(".login_popup");
const mainPartBlock = document.querySelector(".main");
const hello_label = document.querySelector(".hello");
const statistic = document.querySelector(".statistic_wrapper");
const st_btn = document.querySelector(".st_quiz_btn");
const nd_btn = document.querySelector(".nd_quiz_btn");
const editWrapper = document.querySelector(".edit_pop_up");
const qrCodeWrapper = document.querySelector(".qr_code_popup_wrapper");
let tasks = document.querySelector(".tasks");
let editFields = document.querySelector(".edit_pop_up_items");
const createTaskField = document.querySelector(".create_task_title");
const createTaskBtn = document.querySelector(".create_task");
const logoutBtn = document.querySelector(".logout_btn");
let d;

enterPageBlock.style.display = "none";
mainPartBlock.style.display = "none";

// старт квиза
st_btn.addEventListener("click", () => {
  let currentTitle = document.querySelector(".qr_code_popup_title").innerHTML;

  if (isNewQuizNone(currentTitle)) {
    alert("Вы не можете начать пустой опрос!");
    return;
  }
  console.log("startQuiz");
  startQuiz(parseUser().name, currentTitle);
  document.querySelector(".qr_data").style = "display: block";
  st_btn.style = "display: none";
  nd_btn.style = "display: block";
});
// завершение квиза
nd_btn.addEventListener("click", () => {
  let currentTitle = document.querySelector(".qr_code_popup_title").innerHTML;
  console.log("endQuiz");
  document.querySelector(".qr_data").style = "display: none";

  st_btn.style = "display: block";
  nd_btn.style = "display: none";
  endQuiz(parseUser().name, currentTitle);
});
//редактирование тасков
tasks.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest(".task_statistics")) {
    openStatistics(target.closest(".task_statistics"));
  } else if (target.closest(".task_qr")) {
    openQrCode(target.closest(".task_qr"));
  } else if (target.closest(".task_edit")) {
    const currentItem = target.closest(".task_item");
    const currentQuiz = parseUser().quizes[currentItem.getAttribute("index")];
    console.log(currentQuiz);
    openEditTask(currentItem, currentQuiz);
    showEditTaskFields(currentQuiz);
  }
});

document.querySelectorAll(".popup_close").forEach((e) => {
  e.addEventListener("click", (event) => {
    event.target.closest(".popup").classList.remove("active");
  });
});

//слушаю кнопочки каждый раз когда добавляю новые штуки, штобы залетали братки в массив
editWrapper.addEventListener("click", (event) => {
  const target = event.target;
  if (target.closest(".edit_question_delete")) {
    target.closest(".edit_pop_up_item").remove();
  } else if (target.closest(".edit_answer_delete")) {
    target.closest(".edit_pop_up_input_wrapper").remove();
  } else if (target.closest(".edit_pop_up_save")) {
    saveTask();
  } else if (target.closest(".add_field")) {
    document.querySelectorAll(".edit_pop_up_field").forEach((item) => {
      item.setAttribute("value", item.value);
    });
    target
      .closest(".edit_pop_up_item")
      .querySelector(".edit_pop_up_q_fields").innerHTML += getAnswerTemplate();
  } else if (target.closest(".add_question")) {
    document.querySelectorAll(".edit_pop_up_question").forEach((item) => {
      item.setAttribute("value", item.value);
    });
    editFields.innerHTML += getQuestionTemplate();
  } else if (target.closest(".edit_pop_up_del")) {
    deleteTask();
  }
});

window.addEventListener("load", () => {
  if (!JSON.parse(localStorage.getItem("user"))) {
    enterPageBlock.style.display = "grid";
    login();
  } else {
    enterPageBlock.style.display = "none";
    mainPartBlock.style.display = "block";
    showContent();
  }
});

//создать опрос, занести его в бд и отправить на сервер
createTaskBtn.addEventListener("click", (event) => {
  console.log(true);
  if (createTaskField.value.replace(/\s/g, "").length) {
    let user = parseUser();
    for (let el in user.quizes) {
      if (user.quizes[el].title === createTaskField.value) {
        alert("Опрос с таким названием уже существует.");
        return;
      }
    }

    user.quizes.push({
      title: createTaskField.value,
    });
    let arr = [];
    arr[user.quizes.length - 1] = user.quizes[user.quizes.length - 1].title;
    setUser(user);
    showQuizes(document.querySelector(".tasks"), arr);
    createTaskField.value = "";
    //тут я отправлю вам ребята новый объект на сервер
    d = { type: "quizies", name: parseUser().name, data: parseUser() };
    send_to_server("/avenue", d);
  }
});

logoutBtn.addEventListener("click", logout_click);
