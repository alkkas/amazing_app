from flask import Flask, render_template, request, redirect
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
    if request.method == 'POST':
        data = request.get_json(force=True)

        if data['type'] == 'sixDigitCode':
            code = data['code']
            dbResp = db_funcs.getDataByCode(db, data['code'], 6)
            if dbResp is None:
                return json.dumps({'is_exist': 'false'})
            else:
                quizname, username = dbResp
                link = db_funcs.getQuizLink(db, username, quizname)
                return json.dumps({'is_exist': 'true', 'link': link})

    return render_template('homePage.html')


@app.route("/admin", methods=['GET', 'POST'])
def admin_func():
    return render_template('admin_ui.html')


@app.route("/quiz/<twelveDigitCode>", methods=['GET', 'POST'])
def quiz_func(twelveDigitCode):
    # проверяю, есть ли запрашиваемый URL
    if db_funcs.getDataByCode(db, twelveDigitCode, 12) is None:
        return redirect('/', code=302)

    if request.method == 'POST':
        data = request.get_json(force=True)
        if data['type'] == 'readFromDB':
            try:       
                quizname, username = db_funcs.getDataByCode(db, twelveDigitCode, 12)
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

        if data['type'] == 'writeToDB':
            print(data['data'])
            studentName = data['data']['studentName']

            try:
                quizname, owner_name = db_funcs.getDataByCode(db, twelveDigitCode, 12)
                db_funcs.writeDataToStatistic(db, owner_name, quizname, studentName, data['data'])
            except (pymysql.err.InternalError, pymysql.err.InterfaceError):
                print('DB error')
            return json.dumps({'go': 'out'})

    return render_template('userQuizPage.html')


@app.route("/avenue", methods=['POST'])
def data_worker():
    data = request.get_json(force=True)

    if data['type'] == 'check_log':
        is_exist = db_funcs.check_if_user_exists(db, data)
        if is_exist:
            data_from_db = db_funcs.quizies_getter(db, data['username'])
            quizzes_data = db_funcs.getCurrentQuizzes(db, data['username'])
        return json.dumps({"is_exist": is_exist, "data": str(data_from_db), "quizzes_data": quizzes_data})

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
            db_funcs.insertQuizData(db, username, quizname, linkToQuiz, pathToImgQr, sixDigitCode, linkCode)
        except (pymysql.err.InternalError, pymysql.err.InterfaceError):
            print('startQuiz - иди нахуй')
        return json.dumps({"sixdigitcode": sixDigitCode, "pathtoimg": pathToImgQr})
    
    if data['type'] == 'endQuiz':
        print('--- END QUIZ ---')
        username = data['username']
        quizname = data['quizname']
        # db_funcs.quiz_updater(db, username, data['data'])
        try:
            linkToQr = db_funcs.getQuizQr(db, username, quizname)
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