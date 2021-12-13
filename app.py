from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/admin", methods=['GET', 'POST'])
def admin_func():
    if request.method == 'POST':
        name = request.get_json(force=True)
        print(name['name'])
    return render_template('admin_ui.html')

@app.route("/", methods=['GET', 'POST'])
def student_func():
    return render_template('login_template.html')


if __name__ == '__main__':
    app.run(debug=True)