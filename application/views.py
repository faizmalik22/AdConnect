from flask import render_template, request, jsonify
from flask_security import auth_required, roles_required, roles_accepted
from flask_security.utils import hash_password, verify_password
from .models import User, Influencer, Sponsor, Campaign, db


def create_view(app, security):
    
    @app.route('/')
    def home():
        return render_template('index.html')
    

    @app.route('/userlogin', methods=['POST'])
    def userlogin():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message' : 'email or password not provided'}), 400
        
        user = security.datastore.find_user(email = email)

        if not user:
            return jsonify({'message' : 'invalid user'}), 400
        
        if not user.active:
            return jsonify({'message' : 'Sponsor not approved yet'}), 400
        
        if verify_password(password, user.password):
            sponsor = Sponsor.query.filter_by(user_id=user.id).first()
            influencer = Influencer.query.filter_by(user_id=user.id).first()
            sponsor_id = None
            influencer_id = None
            if sponsor:
                sponsor_id = sponsor.id
            if influencer:
                influencer_id = influencer.id
            return jsonify({'token': user.get_auth_token(), 'email': user.email, 'role': user.roles[0].name, 'id': user.id, 'sponsor_id': sponsor_id, 'influencer_id': influencer_id}), 200
        else :
            return jsonify({'message' : 'invalid password'}), 400
        

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        
 
        if not email or not password or role not in ['sponsor', 'influencer']:
            return jsonify({'message' : 'invalid input'}), 403

        if security.datastore.find_user(email = email):
            return jsonify({'message' : 'user already exists'}), 400
        
        if role == 'sponsor':
            security.datastore.create_user(email = email, password = hash_password(password), active = False, roles = ['sponsor'])
            db.session.commit()

            user = User.query.filter_by(email=email).first()

            if user:
                name = data.get('name')
                sponsor = Sponsor(company_name = name, user_id = user.id)
                db.session.add(sponsor)
                db.session.commit()

            return jsonify({'message' : 'Sponsor succesfully created, waiting for admin approval'}), 201
        
        elif role == 'influencer':
            security.datastore.create_user(email = email, password = hash_password(password), active = True, roles=['influencer'])
            db.session.commit()

            user = User.query.filter_by(email=email).first()

            if user:
                name = data.get('name')
                influencer = Influencer(name = name, user_id = user.id)
                db.session.add(influencer)
                db.session.commit()

            return jsonify({'message' : 'Influencer successfully created'}), 201




    @app.route('/test', methods=['GET', 'POST'])
    def tets():
        sponsors = Sponsor.query.all()
        campaigns = Campaign.query.all()
        return render_template('monthly_report.html', data = campaigns)