# Importacion de bibliotecas a usar
from flask import Flask, jsonify

# Instancia de la clase Flask
app = Flask(__name__) 

# Definicion de la ruta principal
@app.route("/")
def root():
    return "Hola Mundo"

# Inicializar nuestra aplicacion
if __name__ =='__main__':
    app.run(debug=True) # Ejecuta la aplicacion en modo debug
