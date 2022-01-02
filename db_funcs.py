from pymysql.converters import escape_string
import json
import extends

# проверка аккаунта админа для последующего входа
def isUserExist(db, username, password):
    cursor = db.cursor()
    password = extends.genHash(password)
    cmd = f'''SELECT 1 FROM main_table WHERE name = '{username}'AND password = '{password}';'''
    v = cursor.execute(cmd)
    # cursor.close()
    if v == 1:
        return True # юзер существует
    return False

# записывает в бд обновлённые данные по квизам
def updateUserQuizzes(db, username, data):
    cursor = db.cursor()
    cmd = f''' UPDATE main_table SET data = "{escape_string(json.dumps(data, ensure_ascii=False))}" WHERE name = "{username}"; '''
    cursor.execute(cmd)
    db.commit()

# получение информации из бд
def getQuizzesFromDB(db, username):
    cursor = db.cursor()
    cmd = f'''SELECT data FROM main_table WHERE name = "{username}";'''
    cursor.execute(cmd)
    data = cursor.fetchone()
    return data['data']

# записывает данные по созданному квизу в БД
def insertQuizData(db, username, quizname, quiz_link, link_to_qr, six_digit_code, twelve_digit_code):
    cursor = db.cursor()
    cmd = f'''
        INSERT INTO data (username, quizname, quiz_link, link_to_qr, six_digit_code, twelve_digit_code)
        VALUES ("{username}", "{quizname}", "{quiz_link}", "{link_to_qr}", "{six_digit_code}", "{twelve_digit_code}");
    '''
    # print(cmd)
    cursor.execute(cmd)
    db.commit()

def updateQuizData(db, username, quizname):
    cursor = db.cursor()
    cmd = f'''
        DELETE FROM data
        WHERE username = "{username}" AND quizname = "{quizname}";
    '''
    # print(cmd)
    cursor.execute(cmd)
    db.commit()

def getQuizQr(db, username, quizname):
    cursor = db.cursor()
    cmd = f'''
        SELECT link_to_qr FROM data 
        WHERE username = "{username}" AND quizname = "{quizname}";
    '''
    cursor.execute(cmd)
    data = cursor.fetchone()
    # print(data)
    return data['link_to_qr']

def getQuizLink(db, username, quizname):
    cursor = db.cursor()
    cmd = f'''
        SELECT quiz_link FROM data 
        WHERE username = "{username}" AND quizname = "{quizname}";
    '''
    cursor.execute(cmd)
    data = cursor.fetchone()
    print(data)
    return data['quiz_link']

def getDataByCode(db, code, num):
    cursor = db.cursor()
    if num == 12:
        cmd = f'''
            SELECT username, quizname FROM data 
            WHERE twelve_digit_code = "{code}";
        '''
    if num == 6:
        cmd = f'''
            SELECT username, quizname FROM data 
            WHERE six_digit_code = "{code}";
        '''
    cursor.execute(cmd)
    data = cursor.fetchone()
    if data is None:
        return None
    return (data['quizname'], data['username'])

def writeDataToStatistic(db, owner_name, quiz_name, student_name, value):
    cursor = db.cursor()
    cmd = f'''
        INSERT INTO quiz_statistics (owner_name, quiz_name, student_name, value)
        VALUES ("{owner_name}", "{quiz_name}", "{student_name}", "{escape_string(json.dumps(value, ensure_ascii=False))}");
    '''
    # print(cmd)
    cursor.execute(cmd)
    db.commit()

def getCurrentQuizzes(db, owner_name):
    cursor = db.cursor()
    cmd = f'''
        SELECT quizname, link_to_qr, six_digit_code FROM data
        WHERE username = "{owner_name}"
    '''
    cursor.execute(cmd)
    data = cursor.fetchall()
    print(data)
    if len(data) == 0:
        return 'None'
    return data

def getCurrentStatistics(db, owner_name, quizname):
    cursor = db.cursor()
    cmd = f'''
        SELECT value FROM quiz_statistics
        WHERE owner_name = "{owner_name}" AND quiz_name = "{quizname}";
    '''
    cursor.execute(cmd)
    data = cursor.fetchall()
    if len(data) == 0:
        return 'None'
    return data

def deleteUnusedStatistics(db, owner_name, quizname):
    cursor = db.cursor()
    cmd = f'''
        DELETE FROM quiz_statistics
        WHERE owner_name = "{owner_name}" AND quiz_name = "{quizname}";
    '''
    # print(cmd)
    cursor.execute(cmd)
    db.commit()