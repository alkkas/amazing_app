from pymysql.converters import escape_string


# проверка аккаунта админа для последующего входа
def check_if_user_exists(db, data):
    cursor = db.cursor()
    username = data['username']
    password = data['password']
    cmd = f'''SELECT 1 FROM main_table WHERE name = '{username}'AND password = '{password}';'''
    v = cursor.execute(cmd)
    # cursor.close()
    if v == 1:
        return True # юзер существует
    return False

# записывает в бд обновлённые данные по квизам
def quiz_updater(db, username, data):
    cursor = db.cursor()
    a = str(data).replace('\'', '\"')
    cmd = f''' UPDATE main_table SET data = "{escape_string(a)}" WHERE name = "{username}"; '''
    cursor.execute(cmd)
    db.commit()

# получение информации из бд
def quizies_getter(db, username):
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
    # cmd = f'''
    #     UPDATE data SET quiz_link="", link_to_qr="", six_digit_code=""
    #     WHERE username = "{username}" AND quizname = "{quizname}";
    # '''
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
        VALUES ("{owner_name}", "{quiz_name}", "{student_name}", "{value}");
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