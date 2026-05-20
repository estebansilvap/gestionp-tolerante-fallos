from database import mysql

class Product:
    def __init__(self,customer, order, product, amount, state, start_date):
        self.customer = customer
        self.order = order
        self.product = product
        self.amount = amount
        self.state = state
        self.start_date = start_date

    def create(self):
        cur = mysql.connection.cursor()
        cur.execute('''INSERT INTO Orders (customer, order, product, amount, state, start_date) 
                    VALUES (%s,%s,%s,%s,%s,%s)''', 
                    (self.customer, self.order, self.product, self.amount, self.state, self.start_date))
        mysql.connection.commit()
        cur.close()
    
    def read(self):
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM Orders')
        products = cur.fetchall()
        cur.close()
        return products

    def update(self,id):
        cur = mysql.connection.cursor()
        cur.execute('UPDATE Orders SET customer = %s order = %s product = %s amount = %s state = %s start_date = %s WHERE id = %s', 
                    (self.customer, self.order, self.product, self.amount, self.state, self.start_date, id))
        mysql.connection.commit()
        cur.close()

    def delete(id):
        cur = mysql.connection.cursor()
        cur.execute('DELET FROM Orders WHERE id = %s', (id))
        mysql.connection.commit()
        cur.close()




