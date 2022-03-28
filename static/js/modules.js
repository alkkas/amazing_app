function parseUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getQuiz(arr, item) {
  return `
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
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 
                            7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 
                            2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 
                            0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 
                            2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 
                            0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 
                            .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 
                            2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 
                            0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 
                            0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 
                            9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 
                            0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 
                            0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                        </svg>
                    </div>
                </div>
            </div>
            `;
}
function getQuestionTemplate() {
  return `<div class="edit_pop_up_item"> 
        <div class="edit_pop_up_question_wrapper">
          <input type="text" class="edit_pop_up_question" placeholder="Введите вопрос">
          <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_question_delete">
        </div>
        <div class="edit_pop_up_q_fields"></div>
        <div class="edit_pop_up_input_wrapper">
          <button class="add_field edit_pop_up_field " placeholder="введите ответ...">Добавить ответ
          <img src="/static/images/close.png" alt="add answer" class="add_field_btn">
        </div>
      </div>`;
}
function getAnswerTemplate(value = "") {
  return `
        <div class="edit_pop_up_input_wrapper">
          <input type="text" class="edit_pop_up_field" placeholder="введите ответ..." value="${value}">
          <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_answer_delete" value="${value}">
        </div>`;
}
function getEditItem(item, currentQuiz) {
  return `
        <div class="edit_pop_up_item"> 
            <div class="edit_pop_up_question_wrapper">
                <input type="text" class="edit_pop_up_question" placeholder="Введите вопрос" value="${
                  item.question
                }">
                <img src="../static/images/trash.png" alt="delete" class="edit_pop_up_delete edit_question_delete">
            </div>
            <div class="edit_pop_up_q_fields quiz-${currentQuiz.quiz.indexOf(
              item
            )}"></div>
            <div class="edit_pop_up_input_wrapper">
                <button class="add_field edit_pop_up_field " placeholder="введите ответ...">Добавить ответ
                <img src="/static/images/close.png" alt="add answer" class="add_field_btn">
            </div>
        </div>`;
}
export {
  parseUser,
  setUser,
  getQuiz,
  getQuestionTemplate,
  getAnswerTemplate,
  getEditItem,
};
