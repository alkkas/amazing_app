from flask import Flask, render_template, request
import db_funcs
import json

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def student_func():
    return render_template('login_template.html')


@app.route("/admin", methods=['GET', 'POST'])
def admin_func():
    if request.method == 'POST':
        data = request.get_json(force=True)
        is_exist = db_funcs.check_if_user_exists(data)
        return json.dumps({"is_exist": is_exist})
    return render_template('admin_ui.html')


@app.route("/avenue", methods=['POST'])
def data_worker():
    data = request.get_json(force=True)
    return json.dumps({"hello": "world"})


if __name__ == '__main__':
    app.run(debug=True)