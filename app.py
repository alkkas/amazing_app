from flask import Flask, render_template, request, redirect, send_from_directory
import modules.db_funcs as db_funcs, modules.extends as extends
import logging
import pymysql
import modules.config as config
import json
import os

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',\
    level=logging.DEBUG, filename='log.log', filemode='a',\
        encoding='UTF-8', datefmt='%d-%b-%y %H:%M:%S')
logging.getLogRecordFactory


app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def student_func():
    if request.method == 'POST':
        data = request.get_json(force=True)

        if data['type'] == 'sixDigitCode':
            dbResp = db_funcs.getDataByCode(data['code'], 6)
            if dbResp is None:
                return json.dumps({'is_exist': 'false'})
            else:
                quizname, username = dbResp
                link = db_funcs.getQuizLink(username, quizname)
                return json.dumps({'is_exist': 'true', 'link': link})

        if data['type'] == 'registerUser':
            email = data['email']
            username = data['username']
            password = data['password']
            logging.info(f'New user was registred: {email} {username}')
            if db_funcs.checkNameAndEmail(username, email) == False: #значит такого юзера нет в базе
                db_funcs.registerNewUser(username, email, password)
                quizzes = db_funcs.getQuizzesFromDB(username)
                
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
    if db_funcs.getDataByCode(twelveDigitCode, 12) is None:
        return redirect('/', code=302)

    if request.method == 'POST':
        data = request.get_json(force=True)
        if data['type'] == 'readFromDB':
            try:       
                quizname, username = db_funcs.getDataByCode(twelveDigitCode, 12)
                allQuizData = db_funcs.getQuizzesFromDB(username)
            except Exception as e:
                logging.error('DB error while read user quizzes!', exc_info=True)
            
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
                quizname, owner_name = db_funcs.getDataByCode(twelveDigitCode, 12)
                db_funcs.writeDataToStatistic(owner_name, quizname, studentName, data['data'])
            except Exception as e:
                logging.error('DB error while write user quizzes!', exc_info=True)
            return json.dumps({'go': 'out'})

    return render_template('userQuizPage.html')


@app.route("/avenue", methods=['POST'])
def data_worker():
    data = request.get_json(force=True)

    if data['type'] == 'check_log':
        is_exist = db_funcs.isUserExist(data['username'], data['password'])
        if is_exist:
            data_from_db = db_funcs.getQuizzesFromDB(data['username'])
            # quizzes_data = db_funcs.getCurrentQuizzes(data['username'])
            logging.info(f"New login - {data['username']}")
            # return json.dumps({"is_exist": is_exist, "data": str(data_from_db), "quizzes_data": quizzes_data})
            print(data_from_db, type(data_from_db))
            return json.dumps({"is_exist": is_exist, "data": data_from_db})
        return json.dumps({"is_exist": is_exist})
        

    if data['type'] == 'quizies':
        # logging.debug(data)
        try:
            db_funcs.updateUserQuizzes(data['name'], data['data'])
        except Exception as e:
            logging.error('Запись в бд - иди нахуй', exc_info=True)
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
            db_funcs.insertQuizData(username, quizname, linkToQuiz, pathToImgQr, sixDigitCode, linkCode)
        except Exception as e:
            logging.debug('startQuiz - иди нахуй', exc_info=True)
        return json.dumps({"sixdigitcode": sixDigitCode, "pathtoimg": pathToImgQr})
    
    if data['type'] == 'endQuiz':
        username = data['username']
        quizname = data['quizname']
        logging.info(f'END QUIZ {username} - {quizname}')
        try:
            linkToQr = db_funcs.getQuizQr(username, quizname)
            db_funcs.updateQuizData(username, quizname)
            db_funcs.deleteUnusedStatistics(username, quizname)
        except Exception as e:
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
        statistics_data = db_funcs.getCurrentStatistics(data['username'], data['quiz_name'])
        logging.info(f"Getting statistics for {data['username']} - {data['quiz_name']}")
        return json.dumps({"statistics_data": statistics_data})


@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5050)