import pymysql
from pymysql.converters import escape_string







# def com():  # Изменение фундамента бд
#     cmd = '''SET names 'utf8';'''
#     cursor.execute(cmd)
#     connection.commit()
#     print('Команда редактирования выполнена')


def teacher_imit():  # Имитация переменной с данными от преподавателя
    teacher_info = {"name": "username", "password": "12345678"}
    teacher_data = {"name": "Amazing quiz", "quiz": [
        {
            "question": "What's the largest planet in solar system?",
            "answers": [
                "variant 1",
                "variant 2",
                "variant 3"
            ]
        },
        {
            "question": "Why Mars has red color?",
            "answers": [
                "variant 1",
                "variant 2",
                "variant 3"
            ]
        },
        {
            "question": "Почему бебра сладкая???",
            "answers": [
                "variant 1",
                "variant 2",
                "variant 3"
            ]
        }
    ], 'teacher_info': teacher_info}
    return teacher_data


def check_if_user_exists(db, data): # проверка аккаунта админа для последующего входа
    cursor = db.cursor()
    username = data['username']
    password = data['password']
    cmd = f'''SELECT 1 FROM main_table WHERE name = '{username}'AND password = '{password}';'''
    v = cursor.execute(cmd)
    # cursor.close()
    if v == 1:
        return True # юзер существует
    return False


def quiz_updater(db, username, data):  # записывает в бд обновлённые данные по квизам
    cursor = db.cursor()
    a = str(data).replace('\'', '\"')
    cmd = f''' UPDATE main_table SET data = "{escape_string(a)}" WHERE name = "{username}"; '''
    cursor.execute(cmd)
    db.commit()
    # cursor.close()


def quizies_getter(db, username):  # получение информации из бд
    cursor = db.cursor()
    cmd = f'''SELECT data FROM main_table WHERE name = "{username}";'''
    cursor.execute(cmd)
    data = cursor.fetchone()
    print(data)
    return data['data']

def insertQuizData(db, username, quizname, quiz_link, link_to_qr, six_digit_code):
    cursor = db.cursor()
    cmd = f'''
        INSERT INTO data (username, quizname, quiz_link, link_to_qr, six_digit_code)
        VALUES ("{username}", "{quizname}", "{quiz_link}", "{link_to_qr}", "{six_digit_code}");
    '''
    print(cmd)
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
    print(cmd)
    cursor.execute(cmd)
    db.commit()

def getQuizInfo(db, username, quizname):
    cursor = db.cursor()
    cmd = f'''
        SELECT link_to_qr FROM data 
        WHERE username = "{username}" AND quizname = "{quizname}";
    '''
    cursor.execute(cmd)
    data = cursor.fetchone()
    print(data)
    # d = data['link_to_qr']
    # d = d.split('/')
    # filename = d[len(d)-1]
    return data['link_to_qr']

# def update_dyn(data):  # Авто-создание критериев в динамической таблице
#     global k
#     k = len(data['quiz'])
#     hp = 'q'
#     for i in range(1, k + 1):
#         hp += str(i)
#         cmd = f'''ALTER TABLE template_1 ADD COLUMN {hp} INT;'''
#         cursor.execute(cmd)
#         connection.commit()
#         hp = 'q'
#     print('Критерии добавлены!')


# def update_stc(data):  # ДОПИСАТЬ ПРОВЕРКУ ПАРОЛЯ И ИМЕНИ ПОЛЬЗОВАТЕЛЯ
#     a = str(data)
#     cmd = f'''INSERT INTO main_table (name, password, task_name, data)
#     VALUES ("{data['teacher_info']['name']}", "{data['teacher_info']['password']}", "{data['name']}", "{escape_string(a)}");'''
#     cursor.execute(cmd)
#     connection.commit()


# def fill_dyn(pupil_answer):  # Заполнение таблицы в бд, используя ответ школьника
#     marks = []
#     hp = 'q'
#     name = pupil_answer[0]
#     for i in pupil_answer[1].values():
#         marks.append(i)
#     cmd = f'''INSERT template_1(name)
#     VALUES("{name}");'''
#     cursor.execute(cmd)
#     for i in range(1, k + 1):
#         hp += str(i)
#         cmd = f'''UPDATE template_1 SET {hp} = {marks[i - 1]};'''
#         cursor.execute(cmd)
#         connection.commit()
#         hp = 'q'
#     pupil_answer = []
#     print('Ответ занесен!')


# def clean():  # Полная очистка таблицы
#     hp = 'q'
#     cmd = '''TRUNCATE TABLE template_1;'''
#     cursor.execute(cmd)
#     connection.commit()
#     for i in range(1, 200):
#         try:
#             hp += str(i)
#             cmd = f'''ALTER TABLE template_1 DROP COLUMN {hp};'''
#             cursor.execute(cmd)
#             connection.commit()
#             hp = 'q'
#         except Exception as ex:
#             break
#     cmd = "ALTER TABLE template_1 AUTO_INCREMENT=1;"
#     cursor.execute(cmd)
#     connection.commit()
#     cmd = "ALTER TABLE main_table AUTO_INCREMENT=1;"
#     cursor.execute(cmd)
#     connection.commit()
#     cmd = "TRUNCATE TABLE main_table;"
#     cursor.execute(cmd)
#     connection.commit()
#     print('Очищено!')


# def closing():  # Отключение от базы данных
#     connection.close()
#     print('Отключено!')


# connect()
# clean()
# update_dyn(teacher_imit())
# update_stc(teacher_imit())
# quiz_get()
# closing()