from flask import Flask, render_template, request
import db_funcs, extends
import json

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def student_func():
    return render_template('login_template.html')


@app.route("/admin", methods=['GET', 'POST'])
def admin_func():
    return render_template('admin_ui.html')


@app.route("/avenue", methods=['POST'])
def data_worker():
    data = request.get_json(force=True)
    
    # print(request.get_data())

    if data['type'] == 'check_log':
        is_exist = db_funcs.check_if_user_exists(data)
        if is_exist:
            #send nudes
            data_from_db = db_funcs.quizies_getter(data['username'])
        return json.dumps({"is_exist": is_exist, "data": str(data_from_db)})

    if data['type'] == 'quizies':
        # write it to db
        db_funcs.quiz_updater(data['name'], data['data'])
        # print(data['data'])
        return json.dumps({"hello": "world"})
    
    if data['type'] == 'startQuiz':
        username = data['username']
        quizname = data['quizname']
        sixDigitCode = extends.genSomeCode(6).upper()
        linkCode = extends.genSomeCode(12)
        linkToQuiz = request.host_url+'quiz/'+linkCode
        print(linkToQuiz)
        pathToImg = extends.genQr(linkToQuiz, linkCode+'.png')


        # starting quiz - DONE
        # send to client link to  generated qr code, and 6-digit code - DONE
        return json.dumps({"sixdigitcode": sixDigitCode, "pathtoimg": pathToImg})
    
    if data['type'] == 'endQuiz':
        username = data['username']
        quizname = data['quizname']
        db_funcs.quiz_updater(username, data['data'])
        return json.dumps({"fuck": "you"})

        # update data field in db, and - DONE
        # dong something with statistics


if __name__ == '__main__':
    app.run(debug=True)