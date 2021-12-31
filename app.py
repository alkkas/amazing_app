from flask import Flask, render_template, request
import db_funcs, extends
import pymysql
import json
import os

global db
try:
    db = pymysql.connect(
        host="localhost",
        port=3306,
        user="root",
        password="",
        database="as_proj",
        cursorclass=pymysql.cursors.DictCursor
    )
    print('Подключено!')
except Exception as ex:
    print('Ошибка при подключении!')
    print(ex)

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def student_func():
    return '<h1>А здесь я сделаю главную страницу</h1>'


@app.route("/admin", methods=['GET', 'POST'])
def admin_func():
    return render_template('admin_ui.html')


@app.route("/quiz/<twelveDigitCode>", methods=['GET', 'POST'])
def quiz_func(twelveDigitCode):
    if request.method == 'POST':
        data = request.get_json(force=True)
        if data['type'] == 'getData':
            try:
                quizname, username = db_funcs.getDataByCode(db, twelveDigitCode)
                allQuizData = db_funcs.quizies_getter(db, username)
            except (pymysql.err.InternalError, pymysql.err.InterfaceError):
                print('DB error')
            
            allQuizData = json.loads(allQuizData)
            quiz = ''
            c = 0
            for el in allQuizData['quizes']:
                if el['title'] == quizname:
                    quiz = allQuizData['quizes'][c]
                    break
                c += 1
            return json.dumps(quiz)
        if data['type'] == 'sendData':
            studentName = data['data']['studentName']
            answers = data['data']['answers']
            print(studentName, answers)
            return json.dumps({'go': 'out'})

    return render_template('userQuizPage.html')


@app.route("/avenue", methods=['POST'])
def data_worker():
    data = request.get_json(force=True)

    if data['type'] == 'check_log':
        is_exist = db_funcs.check_if_user_exists(db, data)
        if is_exist:
            data_from_db = db_funcs.quizies_getter(db, data['username'])
        return json.dumps({"is_exist": is_exist, "data": str(data_from_db)})

    if data['type'] == 'quizies':
        # write it to db
        db_funcs.quiz_updater(db, data['name'], data['data'])
        return json.dumps({"hello": "world"})
    
    if data['type'] == 'startQuiz':
        print('--- START QUIZ ---')

        username = data['username']
        quizname = data['quizname']

        sixDigitCode = extends.genSomeCode(6).upper()
        linkCode = extends.genSomeCode(12)
        linkToQuiz = request.host_url+'quiz/'+linkCode
        print(linkToQuiz)
        pathToImgQr = extends.genQr(linkToQuiz, linkCode+'.png')
        try:
            db_funcs.insertQuizData(db, username, quizname, linkToQuiz, pathToImgQr, sixDigitCode)
        except (pymysql.err.InternalError, pymysql.err.InterfaceError):
            print('startQuiz - иди нахуй')
        return json.dumps({"sixdigitcode": sixDigitCode, "pathtoimg": pathToImgQr})
    
    if data['type'] == 'endQuiz':
        print('--- END QUIZ ---')
        username = data['username']
        quizname = data['quizname']
        # db_funcs.quiz_updater(db, username, data['data'])
        try:
            linkToQr = db_funcs.getQuizInfo(db, username, quizname)
            db_funcs.updateQuizData(db, username, quizname)
        except (pymysql.err.InternalError, pymysql.err.InterfaceError):
            print('endQuiz - иди нахуй')

        print('-'*20, linkToQr)
        try:
            path = os.path.join(os.path.abspath(os.path.dirname(__file__)), linkToQr.replace('/', '\\'))
            os.remove(path)
        except FileNotFoundError:
            pass

        return json.dumps({"fuck": "you"})

        # update data field in db, and - DONE
        # dong something with statistics


if __name__ == '__main__':
    app.run(debug=True)