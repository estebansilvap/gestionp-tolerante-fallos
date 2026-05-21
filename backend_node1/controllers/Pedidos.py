from flask import Blueprint, render_template, request, jsonify
from models.Pedidos import Product

orders = Blueprint('orders', __name__)

@orders.route('/api/productos', methods = ['GET'])
def get_product():
    products = Product.get_products()
    return jsonify(products)

@orders.route('/api/productos', methods = ['POST'])
def add_product():
    data = request.json

    customer = data.get('customer')
    order = data.get('order')
    product = data.get('product')
    amount = data.get('amount')
    state = data.get('state')
    start_date = data.get('start_date')

    if not data:
        return jsonify({"error": "No se guardaron los datos"})

    Product.create(customer,order,product,amount,state,start_date)
    su = 'se registro correctamente el producto'
    return render_template('index.html', su = su)
    
@orders.route('/api/productos/<int:id>', methods = ['PUT'])
def update_product(id):
    data = request.json

    customer = data.get('customer')
    order = data.get('order')
    product = data.get('product')
    amount = data.get('amount')
    state = data.get('state')
    start_date = data.get('start_date')

    if not data:
        return jsonify({"error": "No se enviaron datos"})

    Product.update(customer,order,product,amount,state,start_date,id)
    su = 'se actualizo correctamente'
    return render_template('index.html', su = su)

@orders.route('/api/productos/<int:id>', methods = ['DELETE'])
def delete_product(id):
    Product.delete(id)
    return jsonify({'msg': 'producto eliminado'})



    
