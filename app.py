from flask import Flask, render_template, request
import db_funcs
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

    if data['type'] == 'check_log':
        is_exist = db_funcs.check_if_user_exists(data)
        if is_exist:
            #send nudes
            data_from_db = db_funcs.quizies_getter(data['username'])
        return json.dumps({"is_exist": is_exist, "data": str(data_from_db)})

    if data['type'] == 'quizies':
        # write it to db
        db_funcs.quiz_updater(data['name'], data['data'])
        print(data['data'])
        return json.dumps({"hello": "world"})


if __name__ == '__main__':
    app.run(debug=True)