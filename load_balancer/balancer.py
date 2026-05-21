from flask import Flask, request
import requests

app = Flask(__name__)

servers = [
    "http://localhost:5000",
    "http://localhost:5001"
]

current = 0

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def balancear(path):

    global current

    server = servers[current]

    current = (current + 1) % len(servers)

    url = f"{server}/api/{path}"

    try:

        response = requests.request(
            method=request.method,
            url=url,
            json=request.get_json(silent=True)
        )

        return (
            response.content,
            response.status_code,
            response.headers.items()
        )

    except:

        return {
            "error": "Servidor no disponible"
        }, 500

if __name__ == '__main__':

    app.run(port=8000)