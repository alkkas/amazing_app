from pymysql.converters import escape_string
import json
import modules.extends as extends
import logging

from .models import engine, Data, MainTable, QuizStatistics
from sqlalchemy.orm import Session


# проверка аккаунта админа для последующего входа
def isUserExist(username, password):
    session = Session(bind=engine)

    username = escape_string(username)
    password = extends.genHash(password)

    response = session.query(MainTable).filter(\
        MainTable.name == username, \
        MainTable.password == password).first()

    if response is not None:
        return True # юзер существует
    return False


# проверка имени пользователя и email на наличие в базе
def checkNameAndEmail(username, email):
    session = Session(bind=engine)

    username = escape_string(username)
    email = escape_string(email)

    response1 = session.query(MainTable).filter(\
        MainTable.name == username).all()
    
    response2 = session.query(MainTable).filter(\
        MainTable.email == email).all()

    if len(response1) != 0 or len(response2) != 0:
        return True # юзер существует
    return False


def registerNewUser(username, email, password):
    session = Session(bind=engine)

    username = escape_string(username)
    email = escape_string(email)
    data_temp = '''{"name": "'''+username+'''", "quizes": []}'''
    password_hash = extends.genHash(password)

    new_user = MainTable(
        name=username,
        email=email,
        password=password_hash,
        settings='',
        data=data_temp
    )
    session.add(new_user)
    session.commit()

    logging.debug(f'INFO: {username} was registered')


# записывает в бд обновлённые данные по квизам
def updateUserQuizzes(username, data):
    session = Session(bind=engine)

    username = escape_string(username)

    data = session.query(MainTable).filter(MainTable.name == username).\
        update({'data': json.dumps(data, ensure_ascii=False)})

    session.commit()


# получение информации из бд
def getQuizzesFromDB(username):
    session = Session(bind=engine)

    username = escape_string(username)

    data = session.query(MainTable).filter(
        MainTable.name == username
    ).first()

    return data.data


# записывает данные по созданному квизу в БД
def insertQuizData(username, quizname, quiz_link, link_to_qr, six_digit_code, twelve_digit_code):
    session = Session(bind=engine)

    username = escape_string(username)
    quizname = escape_string(quizname)

    insertion = Data(
        username=username,
        quizname=quizname,
        quiz_link=quiz_link,
        link_to_qr=link_to_qr,
        six_digit_code=six_digit_code,
        twelve_digit_code=twelve_digit_code
    )

    session.add(insertion)
    session.commit()


def updateQuizData(username, quizname):
    session = Session(bind=engine)

    username = escape_string(username)
    quizname = escape_string(quizname)

    deletion = session.query(Data).filter(
        Data.username == username,
        Data.quizname == quizname
    ).one()

    session.delete(deletion)
    session.commit()


def getQuizQr(username, quizname):
    session = Session(bind=engine)

    username = escape_string(username)
    quizname = escape_string(quizname)

    data = session.query(Data).filter(
        Data.username == username,
        Data.quizname == quizname
    ).first()

    return data.link_to_qr


def getQuizLink(username, quizname):
    session = Session(bind=engine)

    username = escape_string(username)
    quizname = escape_string(quizname)

    data = session.query(Data).filter(
        Data.username == username,
        Data.quizname == quizname
    ).first()

    return data.quiz_link


def getDataByCode(code, num):
    session = Session(bind=engine)

    data = session.query(Data).filter(
        Data.twelve_digit_code == code
    ).first()

    if num == 12:
        data = session.query(Data).filter(
            Data.twelve_digit_code == code
        ).first()
    if num == 6:
        data = session.query(Data).filter(
            Data.six_digit_code == code
        ).first()

    print(data, data.quizname, data.username)

    if data is None:
        return None
    return (data.quizname, data.username)


# def getCurrentQuizzes(owner_name):
#     session = Session(bind=engine)

#     owner_name = escape_string(owner_name)

#     data = session.query(Data).filter(
#         Data.username == owner_name
#     ).first()

#     cmd = f'''
#         SELECT quizname, link_to_qr, six_digit_code FROM data
#         WHERE username = "{owner_name}"
#     '''
#     cursor.execute(cmd)
#     data = cursor.fetchall()
#     logging.debug(data)
#     cursor.close()
#     if len(data) == 0:
#         return 'None'
#     return data


def writeDataToStatistic(owner_name, quiz_name, student_name, value):
    session = Session(bind=engine)

    owner_name = escape_string(owner_name)
    quiz_name = escape_string(quiz_name)
    student_name = escape_string(student_name)

    writing = QuizStatistics(
        owner_name=owner_name,
        quiz_name=quiz_name,
        student_name=student_name,
        value=json.dumps(value, ensure_ascii=False)
    )
    session.add(writing)
    session.commit()


def getCurrentStatistics(owner_name, quizname):
    session = Session(bind=engine)

    owner_name = escape_string(owner_name)
    quizname = escape_string(quizname)

    data = session.query(QuizStatistics).filter(
        QuizStatistics.owner_name == owner_name,
        QuizStatistics.quiz_name == quizname
    ).all()

    for i in range(len(data)):
        data[i] = json.loads(data[i].value)

    if len(data) == 0:
        return None
    return data
    

def deleteUnusedStatistics(owner_name, quizname):
    session = Session(bind=engine)

    owner_name = escape_string(owner_name)
    quizname = escape_string(quizname)

    deletion = session.query(QuizStatistics).filter(
        QuizStatistics.owner_name == owner_name,
        QuizStatistics.quiz_name == quizname
    ).delete(synchronize_session='fetch')

    session.commit()
