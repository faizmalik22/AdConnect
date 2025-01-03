from .extensions import db
from flask_security.models import fsqla_v3 as fsqla
from flask_security import UserMixin, RoleMixin
from datetime import datetime                                                             #for setting default datetime

fsqla.FsModels.set_db_info(db)




class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)
    active = db.Column(db.Boolean, nullable = False)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='user_roles', backref='users')
    sponsor = db.relationship('Sponsor', backref='user')
    influencer = db.relationship('Influencer', backref='user')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), primary_key=True) 







class Sponsor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String, default='NA', nullable = False)
    industry = db.Column(db.String, default='NA', nullable = False)                                         #tech
    budget = db.Column(db.Float, default=0 , nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

class Influencer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, default='NA', nullable=False)                                           #tech
    niche = db.Column(db.String, default='NA', nullable=False)                                              #smartphone
    reach = db.Column(db.Integer, default=0, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image_name = db.Column(db.String, nullable=False, default='default.jpg')
    description = db.Column(db.Text)
    category = db.Column(db.String, nullable=False)                                            #tech
    start_date = db.Column(db.DateTime, default=datetime(2000, 1, 1), nullable=False)
    end_date = db.Column(db.DateTime, default=datetime(2000, 1, 1), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    visibility = db.Column(db.String, default='private', nullable=False)                       #public
    goals = db.Column(db.Text)
    sponsor_id = db.Column(db.Integer, db.ForeignKey('sponsor.id'), nullable=False)

    sponsor = db.relationship('Sponsor', backref='campaigns')

class AdRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    messages = db.Column(db.Text)
    requirements = db.Column(db.Text)
    payment_amount = db.Column(db.Float, nullable=False)
    sponsor_negotiation_amount = db.Column(db.Float, default=0, nullable=False)
    influencer_negotiation_amount = db.Column(db.Float, default=0, nullable=False)
    status = db.Column(db.String(50), default='pending')                                        #cancelled, accepted, rejected
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    influencer_id = db.Column(db.Integer, db.ForeignKey('influencer.id'), nullable=False)

    campaign = db.relationship('Campaign', backref='adrequests')
    influencer = db.relationship('Influencer', backref='adrequests')

class Follow(db.Model):
    __tablename__ = 'follows'
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)