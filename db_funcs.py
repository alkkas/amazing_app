import pymysql
import json
from pymysql.converters import escape_string


def connect():  # Подключение к бд
    global cursor
    global connection
    try:
        connection = pymysql.connect(
            host="localhost",
            port=3306,
            user="root",
            password="",
            database="as_proj",
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = connection.cursor()
        print('Подключено!')
    except Exception as ex:
        print('Ошибка при подключении!')
        print(ex)


def com():  # Изменение фундамента бд
    cmd = '''SET names 'utf8';'''
    cursor.execute(cmd)
    connection.commit()
    print('Команда редактирования выполнена')


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


# def pupil_imit(): # Имитация переменной с данными от школьника
#     global pupil_answer
#     pupil_answer = []
#     pupil_answer.append(input('Ваше Имя'))
#     pupil_answer.append(dict())
#     for i in range(k_qual):
#         mark = int(input(f'Оценка за {data_teacher[0][i]}'))
#         pupil_answer[1][data_teacher[0][i]] = mark
#     return(pupil_answer)

def check_if_user_exists(data): # проверка аккаунта админа для последующего входа
    username = data['username']
    password = data['password']
    cmd = f'''SELECT 1 FROM main_table WHERE name = '{username}'AND password = '{password}';'''
    v = cursor.execute(cmd)
    if v == 1:
        return True # юзер существует
    return False

def quiz_get():  # получение информации из бд
    ch = input('название квиза?')
    cmd = f'''SELECT data FROM main_table WHERE task_name = '{ch}';'''
    cursor.execute(cmd)
    for row in cursor:
        a = row['data']
    print(a)
    print(json.loads(a))


def update_dyn(data):  # Авто-создание критериев в динамической таблице
    global k
    k = len(data['quiz'])
    hp = 'q'
    for i in range(1, k + 1):
        hp += str(i)
        cmd = f'''ALTER TABLE template_1 ADD COLUMN {hp} INT;'''
        cursor.execute(cmd)
        connection.commit()
        hp = 'q'
    print('Критерии добавлены!')


def update_stc(data):  # ДОПИСАТЬ ПРОВЕРКУ ПАРОЛЯ И ИМЕНИ ПОЛЬЗОВАТЕЛЯ
    a = str(data)
    cmd = f'''INSERT INTO main_table (name, password, task_name, data)
    VALUES ("{data['teacher_info']['name']}", "{data['teacher_info']['password']}", "{data['name']}", "{escape_string(a)}");'''
    cursor.execute(cmd)
    connection.commit()


def fill_dyn(pupil_answer):  # Заполнение таблицы в бд, используя ответ школьника
    marks = []
    hp = 'q'
    name = pupil_answer[0]
    for i in pupil_answer[1].values():
        marks.append(i)
    cmd = f'''INSERT template_1(name)
    VALUES("{name}");'''
    cursor.execute(cmd)
    for i in range(1, k + 1):
        hp += str(i)
        cmd = f'''UPDATE template_1 SET {hp} = {marks[i - 1]};'''
        cursor.execute(cmd)
        connection.commit()
        hp = 'q'
    pupil_answer = []
    print('Ответ занесен!')


def clean():  # Полная очистка таблицы
    hp = 'q'
    cmd = '''TRUNCATE TABLE template_1;'''
    cursor.execute(cmd)
    connection.commit()
    for i in range(1, 200):
        try:
            hp += str(i)
            cmd = f'''ALTER TABLE template_1 DROP COLUMN {hp};'''
            cursor.execute(cmd)
            connection.commit()
            hp = 'q'
        except Exception as ex:
            break
    cmd = "ALTER TABLE template_1 AUTO_INCREMENT=1;"
    cursor.execute(cmd)
    connection.commit()
    cmd = "ALTER TABLE main_table AUTO_INCREMENT=1;"
    cursor.execute(cmd)
    connection.commit()
    cmd = "TRUNCATE TABLE main_table;"
    cursor.execute(cmd)
    connection.commit()
    print('Очищено!')


def closing():  # Отключение от базы данных
    connection.close()
    print('Отключено!')


connect()
# clean()
# update_dyn(teacher_imit())
# update_stc(teacher_imit())
# quiz_get()
# closing()