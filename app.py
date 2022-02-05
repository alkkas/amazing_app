from flask import Flask, render_template, request, redirect, send_from_directory
import db_funcs, extends
import logging
import pymysql
import config
import json
import os

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.DEBUG, filename='log.log', filemode='w', encoding='UTF-8', datefmt='%d-%b-%y %H:%M:%S')
logging.getLogRecordFactory


global db
try:
    db = pymysql.connect(
        host=config.db_host,
        port=3306,
        user=config.db_user,
        password=config.db_password,
        database=config.db_name,
        cursorclass=pymysql.cursors.DictCursor
    )
    logging.info('Connected to DB!')
except Exception as ex:
    logging.error('Error in DB connection!', exc_info=True)

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

        if data['type'] == 'registerUser':
            email = data['email']
            username = data['username']
            password = data['password']
            logging.info(f'New user was registred: {email} {username}')
            if db_funcs.checkNameAndEmail(db, username, email) == False: #значит такого юзера нет в базе
                db_funcs.registerNewUser(db, username, email, password)
                quizzes = db_funcs.getQuizzesFromDB(db, username)
                
                return json.dumps({'userAlreadyExist': 'false', 'quizzes': quizzes})
            else:
                return json.dumps({'userAlreadyExist': 'true'})

    return render_template('homePage.html')

@app.route("/start", methods=['GET'])
def start_func():
    return render_template('startPage.html')

@app.route("/admin", methods=['GET'])
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
                allQuizData = db_funcs.getQuizzesFromDB(db, username)
            except (pymysql.err.InternalError, pymysql.err.InterfaceError):
                logging.error('DB error while read user quizzes!')
            
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
            # logging.debug(data['data'])
            studentName = data['data']['studentName']

            try:
                quizname, owner_name = db_funcs.getDataByCode(db, twelveDigitCode, 12)
                db_funcs.writeDataToStatistic(db, owner_name, quizname, studentName, data['data'])
            except (pymysql.err.InternalError, pymysql.err.InterfaceError):
                logging.error('DB error while write user quizzes!')
            return json.dumps({'go': 'out'})

    return render_template('userQuizPage.html')


@app.route("/avenue", methods=['POST'])
def data_worker():
    data = request.get_json(force=True)

    if data['type'] == 'check_log':
        is_exist = db_funcs.isUserExist(db, data['username'], data['password'])
        # logging.debug(data['username'], data['password'], is_exist)
        if is_exist:
            data_from_db = db_funcs.getQuizzesFromDB(db, data['username'])
            quizzes_data = db_funcs.getCurrentQuizzes(db, data['username'])
            return json.dumps({"is_exist": is_exist, "data": str(data_from_db), "quizzes_data": quizzes_data})
        return json.dumps({"is_exist": is_exist})
        

    if data['type'] == 'quizies':
        # logging.debug(data)
        try:
            db_funcs.updateUserQuizzes(db, data['name'], data['data'])
        except (pymysql.err.InternalError, pymysql.err.InterfaceError):
            logging.error('Запись в бд - иди нахуй')
        return json.dumps({"hello": "world"})
    
    if data['type'] == 'startQuiz':
        username = data['username']
        quizname = data['quizname']
        logging.info(f'START QUIZ {username} - {quizname}')

        sixDigitCode = extends.genSomeCode(6).upper()
        linkCode = extends.genSomeCode(12)
        linkToQuiz = request.host_url+'quiz/'+linkCode
        # logging.debug(linkToQuiz)
        pathToImgQr = extends.genQr(linkToQuiz, linkCode+'.png')
        try:
            db_funcs.insertQuizData(db, username, quizname, linkToQuiz, pathToImgQr, sixDigitCode, linkCode)
        except (pymysql.err.InternalError, pymysql.err.InterfaceError, AttributeError):
            logging.debug('startQuiz - иди нахуй')
        return json.dumps({"sixdigitcode": sixDigitCode, "pathtoimg": pathToImgQr})
    
    if data['type'] == 'endQuiz':
        username = data['username']
        quizname = data['quizname']
        logging.info(f'END QUIZ {username} - {quizname}')
        try:
            linkToQr = db_funcs.getQuizQr(db, username, quizname)
            db_funcs.updateQuizData(db, username, quizname)
            db_funcs.deleteUnusedStatistics(db, username, quizname)
        except (pymysql.err.InternalError, pymysql.err.InterfaceError, AttributeError, TypeError) as er:
            logging.error('endQuiz - иди нахуй', exc_info=True)

        try:
            # for windows version
            path = os.path.join(os.path.abspath(os.path.dirname(__file__)), linkToQr.replace('/', '\\'))
            os.remove(path)
        except FileNotFoundError:
            # for linux version
            try:
                path = os.path.join(os.path.abspath(os.path.dirname(__file__)), linkToQr)
                os.remove(path)
            except FileNotFoundError: logging.warning(f'Internal server error while deleting file {linkToQr}')

        return json.dumps({"fuck": "you"})

        # update data field in db, and - DONE
        # dong something with statistics
    if data['type'] == 'getStatistics':
        statistics_data = db_funcs.getCurrentStatistics(db, data['username'], data['quiz_name'])
        logging.info(f"Getting statistics for {data['username']} - {data['quiz_name']}")
        return json.dumps({"statistics_data": statistics_data})


@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5050)