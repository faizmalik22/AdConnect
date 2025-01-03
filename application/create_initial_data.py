from flask_security import hash_password
from .extensions import db
from .models import User, Sponsor, Influencer

def create_data(security):

    security.datastore.find_or_create_role(name='admin', description = "Administrator")
    security.datastore.find_or_create_role(name='sponsor', description = "Sponsor")
    security.datastore.find_or_create_role(name='influencer', description = "Influencer")

    if not security.datastore.find_user(email = "admin@gmail.com"):
        security.datastore.create_user(email = "admin@gmail.com", password = hash_password("pass"), active=True, roles=['admin'])
    if not security.datastore.find_user(email = "sponsor@gmail.com"):
        security.datastore.create_user(email = "sponsor@gmail.com", password = hash_password("pass"), active=True, roles=['sponsor'])
    if not security.datastore.find_user(email = "influencer@gmail.com"):
        security.datastore.create_user(email = "influencer@gmail.com", password = hash_password("pass"), active=True, roles=['influencer'])

    db.session.commit()




    user_sponsor = User.query.filter_by(email="sponsor@gmail.com").first()
    sponsor = Sponsor.query.filter_by(user_id=user_sponsor.id).first()
    if not sponsor:
        name = "DEFAULT SPONSOR"
        sponsor = Sponsor(company_name = name, user_id = user_sponsor.id)
        db.session.add(sponsor)
        db.session.commit()
    

    user_influencer = User.query.filter_by(email="influencer@gmail.com").first()
    influencer = Influencer.query.filter_by(user_id=user_influencer.id).first()
    if not influencer:
        name = "DEFAULT INFLUENCER"
        influencer = Influencer(name = name, user_id = user_influencer.id)
        db.session.add(influencer)
        db.session.commit()
