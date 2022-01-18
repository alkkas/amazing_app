const popupClose = document.querySelector('.close_popup');

// register popup
popupClose.addEventListener('click', (e) => {
    document.querySelector('.auth_popup').classList.toggle('active_popup');
    enableScroll();
});
document.querySelector('.runpop1').addEventListener('click', () => {
    let data = localStorage.getItem('username');
    if (data != null) {
        console.log('redirecting');
        window.location.href = '/admin';
        return;
    }
    document.querySelector('.auth_popup').classList.toggle('active_popup');
    disableScroll();
});
document.querySelector('.runpop2').addEventListener('click', () => {
    let data = localStorage.getItem('username');
    if (data != null) {
        console.log('redirecting');
        window.location.href = '/admin';
        return;
    }
    document.querySelector('.auth_popup').classList.toggle('active_popup');
    disableScroll();
});

// register lol
document.getElementById('register').addEventListener('click', (e) => {
    e.preventDefault();
    let email = document.getElementById('reg_email').value;
    let usname = document.getElementById('reg_usname').value;
    let pass = document.getElementById('reg_pass').value;
    console.log(email, usname, pass);
    let data = JSON.stringify({'type': 'registerUser', 'email': email, 'username': usname, 'password': pass });
    let req = new XMLHttpRequest();
    req.open("POST", '/', true);
    req.send(data);
    req.onload = () => {
        if (req.readyState === 4 && req.status === 200) {
            let resp = JSON.parse(req.response);
            if (resp['userAlreadyExist'] == 'true') {
                alert('Пользователь с таким именем или почтой уже существует!')
            } else {
                console.log('done');
                let quiz_obj = JSON.parse(resp['quizzes']);
                console.log(quiz_obj)
                localStorage.setItem('username', usname);
                localStorage.setItem('user', JSON.stringify(quiz_obj));
                document.location.href = '/admin';
            }
        }
    }
});


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