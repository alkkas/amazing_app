from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def hello_world():
    if request.method == 'POST':
        name = request.get_json(force=True)
        print(name['name'])
    return render_template('admin_ui.html')


if __name__ == '__main__':
    app.run(debug=True)
