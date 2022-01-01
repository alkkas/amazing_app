const enterBtn = document.querySelector('.enter_nickname');
const inputField = document.querySelector('.input_nickname_field');

enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9]{6}$/.test(inputField.value)) {
        alert('Неверный формат ввода!');
        return;
    }
    console.log(inputField.value.toUpperCase());
    let data = JSON.stringify({'type': 'sixDigitCode', 'code': inputField.value.toUpperCase()});
    let req = new XMLHttpRequest();
    req.open("POST", '/', true);
    req.send(data);
    req.onload = () => {
        if (req.readyState === 4 && req.status === 200) {
            let resp = JSON.parse(req.response);
            console.log(resp)
            if (resp['is_exist']=='false') {
                alert('Упс, кажется вы ввели неверный код.');
                inputField.value = '';
                return;
            }
            document.location.href = resp['link'];
        }
    }
});