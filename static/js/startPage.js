const enterBtn = document.getElementById('send_quiz');
const codeField = document.getElementById('nickname_field');
const nicknameField = document.getElementById('nickname_field_2');


// quiz starter
enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9]{6}$/.test(codeField.value)) {
        alert('Неверный формат ввода кода!');
        return;
    }
    if (!nicknameField.value.replace(/\s/g, "").length) {
        alert('Введите имя пользователя!');
        return;
    }
    localStorage.setItem('login', nicknameField.value);
    console.log(codeField.value.toUpperCase());
    let data = JSON.stringify({'type': 'sixDigitCode', 'code': codeField.value.toUpperCase()});
    let req = new XMLHttpRequest();
    req.open("POST", '/', true);
    req.send(data);
    req.onload = () => {
        if (req.readyState === 4 && req.status === 200) {
            let resp = JSON.parse(req.response);
            console.log(resp)
            if (resp['is_exist']=='false') {
                alert('Упс, кажется вы ввели неверный код.');
                codeField.value = '';
                return;
            }
            document.location.href = resp['link'];
        }
    }
});
