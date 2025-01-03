from flask_restful import Api, reqparse, fields, Resource, marshal_with, inputs
from .models import Campaign, AdRequest, User, Role, Sponsor, Influencer, db
from sqlalchemy import and_, or_
from flask_security import auth_required, roles_required, roles_accepted
from .extensions import cache
import datetime
from flask import jsonify, send_file, request
from celery.result import AsyncResult
from .tasks import create_csv
from .mail_service import send_email
from .tasks import daily_reminder
from flask_security.utils import hash_password


api = Api(prefix='/api')

parser_campaign = reqparse.RequestParser()
parser_campaign.add_argument('name', type=str)
parser_campaign.add_argument('image_name', type=str)
parser_campaign.add_argument('description', type=str)
parser_campaign.add_argument('category', type=str)
parser_campaign.add_argument('start_date', type=inputs.datetime)
parser_campaign.add_argument('end_date', type=inputs.datetime)
parser_campaign.add_argument('budget', type=float)
parser_campaign.add_argument('visibility', type=str)
parser_campaign.add_argument('goals', type=str)
parser_campaign.add_argument('sponsor_id', type=int)
parser_campaign.add_argument('duration', type=int)


parser_ad = reqparse.RequestParser()
parser_ad.add_argument('messages', type=str)
parser_ad.add_argument('requirements', type=str)
parser_ad.add_argument('payment_amount', type=float)
parser_ad.add_argument('sponsor_negotiation_amount', type=float)
parser_ad.add_argument('influencer_negotiation_amount', type=float)
parser_ad.add_argument('status', type=str)
parser_ad.add_argument('campaign_id', type=int)
parser_ad.add_argument('influencer_id', type=int)

parser_user = reqparse.RequestParser()
parser_user.add_argument('email', type=str)
parser_user.add_argument('password', type=str)

parser_sponsor = reqparse.RequestParser()
parser_sponsor.add_argument('company_name', type=str)
parser_sponsor.add_argument('industry', type=str)
parser_sponsor.add_argument('budget', type=float)
parser_sponsor.add_argument('user_id', type=int)

parser_influencer = reqparse.RequestParser()
parser_influencer.add_argument('name', type=str)
parser_influencer.add_argument('category', type=str)
parser_influencer.add_argument('niche', type=str)
parser_influencer.add_argument('reach', type=int)
parser_influencer.add_argument('user_id', type=int)

marshal_fields_user = {
    'message': fields.String,
    'id' : fields.Integer,
    'email' : fields.String,
    'active' : fields.Boolean,
    'roles' : fields.List(fields.String(attribute='name'))
}

marshal_fields_sponsor = {
    'message': fields.String,
    'id' : fields.Integer,
    'company_name' : fields.String,
    'industry' : fields.String,
    'budget' : fields.String,
    'user_id' : fields.Integer
}

marshal_fields_influencer = {
    'message': fields.String,
    'id' : fields.Integer,
    'name' : fields.String,
    'category' : fields.String,
    'niche' : fields.String,
    'reach' : fields.Integer,
    'user_id' : fields.Integer
}

marshal_fields_campaign = {
    'message': fields.String,
    'id' : fields.Integer,
    'name' : fields.String,
    'image_name' : fields.String,
    'description' : fields.String,
    'category' : fields.String,
    'start_date' : fields.DateTime,
    'end_date' : fields.DateTime,
    'budget' : fields.Float,
    'visibility' : fields.String,
    'goals' : fields.String,
    'sponsor_id' : fields.Integer,
    'sponsor': fields.Nested(marshal_fields_sponsor)
}

marshal_fields_ad = {
    'message': fields.String,
    'id' : fields.Integer,
    'messages' : fields.String,
    'requirements' : fields.String,
    'payment_amount' : fields.Float,
    'sponsor_negotiation_amount' : fields.Float,
    'influencer_negotiation_amount' : fields.Float,
    'status' : fields.String,
    'campaign_id' : fields.Integer,
    'influencer_id' : fields.Integer,
    'campaign': fields.Nested(marshal_fields_campaign),
    'influencer': fields.Nested(marshal_fields_influencer)
}


class CampaignApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor', 'influencer')
    @marshal_with(marshal_fields_campaign)
    def get(self, campaign_id):
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return {"message" : "campaign not found"}, 400
        
        return campaign
    
    @auth_required('token')
    @roles_accepted('admin', 'sponsor')
    def post(self):
        args = parser_campaign.parse_args()

        if not(args.name or args.category or args.budget or args.duration):
            return {"message" : "please enter some details"}, 400

        if not args.name or not args.category or not args.budget or not args.duration:
            return {"message" : "invalid input", "data": args}, 400
        
        if args.duration:
            duration = int(args.duration)
        else:
            duration = int(7)

        start_time = datetime.datetime.now()
        time_delta = datetime.timedelta(days=duration)
        end_time = start_time + time_delta

        campaign = Campaign(name = args.name, description = args.description, category = args.category, start_date = start_time, end_date = end_time, budget = args.budget, visibility = args.visibility, goals = args.goals, sponsor_id = args.sponsor_id)

        db.session.add(campaign)
        db.session.commit()
        return {"message" : "campaign created successfully"}, 200
    
    @auth_required('token')
    @roles_accepted('admin', 'sponsor')
    def put(self, campaign_id):
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return {"message" : "campaign not found"}, 400
        
        args = parser_campaign.parse_args()
        
        if not(args.name or args.category or args.budget or args.visibility):
            return {"message" : "please enter some details"}, 400
        
        if args.name:
            campaign.name = args['name']

        if args.category:
            campaign.category = args['category']

        if args.budget:
            campaign.budget = args['budget']

        if args.visibility:
            campaign.visibility = args['visibility']

        db.session.commit()
        return {"message" : "campaign updated successfully"}, 200
    

    @auth_required('token')
    @roles_accepted('admin', 'sponsor')
    def delete(self, campaign_id):
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return {"message" : "campaign not found"}, 400
        
        db.session.delete(campaign)
        db.session.commit()
        return {"message" : "campaign deleted successfully"}, 200

class Campaigns(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor', 'influencer')
    @marshal_with(marshal_fields_campaign)
    # @cache.cached(timeout=5)
    def get(self):
        campaigns = Campaign.query.all()
        return campaigns


class PublicCampaigns(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor', 'influencer')
    @marshal_with(marshal_fields_campaign)
    def get(self):
        public_campaigns = Campaign.query.filter_by(visibility='public').all()
        return public_campaigns
    
class PrivateCampaigns(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor', 'influencer')
    @marshal_with(marshal_fields_campaign)
    def get(self):
        private_campaigns = Campaign.query.filter_by(visibility='private').all()
        return private_campaigns

class FlagCampaign(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self, campaign_id):
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return {"message" : "campaign not found"}, 400
        
        if campaign.visibility == "private":
            campaign.visibility = "public"
            db.session.commit()
            return {"message" : "campaign made public successfully"}, 200
        if campaign.visibility == "public":
            campaign.visibility = "private"
            db.session.commit()
            return {"message" : "campaign made private successfully"}, 200
        return {"message" : "some error occured"}, 400

class SponsorCampaigns(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor')
    @marshal_with(marshal_fields_campaign)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        sponsor = Sponsor.query.filter_by(user_id=user_id).first()
        sponsor_campaigns = Campaign.query.filter_by(sponsor_id=sponsor.id).all()
        return sponsor_campaigns









class AdRequestApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    @marshal_with(marshal_fields_ad)
    def get(self, adrequest_id):
        adrequest = AdRequest.query.get(adrequest_id)
        if not adrequest:
            return {"message" : "adrequest not found"}, 400
        
        return adrequest
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = parser_ad.parse_args()

        if not(args.messages or args.requirements or args.payment_amount or args.influencer_id):
            return {"message" : "please enter some details"}, 400
        
        if not args.messages or not args.requirements or not args.payment_amount or not args.campaign_id or not args.influencer_id:
            return {"message" : "invalid input"}, 400

        adrequest = AdRequest(messages = args.messages, requirements = args.requirements, payment_amount = args.payment_amount, status = args.status, campaign_id = args.campaign_id, influencer_id = args.influencer_id)
        
        db.session.add(adrequest)
        db.session.commit()
        return {"message" : "adrequest created successfully"}, 200
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, adrequest_id):
        adrequest = AdRequest.query.get(adrequest_id)
        if not adrequest:
            return {"message" : "adrequest not found"}, 400
        
        args = parser_ad.parse_args()
        
        if not(args.messages or args.requirements or args.payment_amount or args.status):
            return {"message" : "please enter some details"}, 400
        
        if args.messages:
            adrequest.messages = args.messages

        if args.requirements:
            adrequest.requirements = args.requirements

        if args.payment_amount:
            adrequest.payment_amount = args.payment_amount

        if args.status:
            adrequest.status = args.status

        db.session.commit()
        return {"message" : "adrequest updated successfully"}, 200
    

    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, adrequest_id):
        adrequest = AdRequest.query.get(adrequest_id)
        if not adrequest:
            return {"message" : "adrequest not found"}, 400
        
        db.session.delete(adrequest)
        db.session.commit()
        return {"message" : "adrequest deleted successfully"}, 200

class AdRequests(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor', 'influencer')
    @marshal_with(marshal_fields_ad)
    def get(self):
        adrequests = AdRequest.query.all()
        return adrequests

class SponsorAdRequests(Resource):
    @auth_required('token')
    @roles_required('sponsor')
    @marshal_with(marshal_fields_ad)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        sponsor = Sponsor.query.filter_by(user_id=user_id).first()
        adrequests = AdRequest.query.filter(and_(AdRequest.influencer_id == sponsor.id, AdRequest.status.in_(["influencer_rejected", "sponsor_rejected", "complete"]) )).all()
        return adrequests
    
    @auth_required('token')
    @roles_required('sponsor')
    def post(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        args = parser_ad.parse_args()

        if not(args.messages or args.requirements or args.payment_amount):
            return {"message" : "please enter some details"}, 400
        
        if not args.messages or not args.requirements or not args.payment_amount:
            return {"message" : "invalid input"}, 400
        
        adrequest = AdRequest(messages = args.messages, requirements = args.requirements, payment_amount = args.payment_amount, sponsor_negotiation_amount = args.payment_amount, status = args.status, campaign_id = args.campaign_id, influencer_id = args.influencer_id)
        
        db.session.add(adrequest)
        db.session.commit()

        return {"message" : "adrequest created successfully"}, 200
    

    @auth_required('token')
    @roles_required('sponsor')
    def put(self, user_id, adrequest_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        args = parser_ad.parse_args()
        adrequest = AdRequest.query.get(adrequest_id)

        if not adrequest:
            return {"message" : "adrequest not found"}, 400
        
        if not(args.messages or args.requirements or args.sponsor_negotiation_amount or args.status):
            return {"message" : "please enter some details"}, 400
        
        if args.messages:
            adrequest.messages = args.messages

        if args.requirements:
            adrequest.requirements = args.requirements

        if args.sponsor_negotiation_amount:
            adrequest.sponsor_negotiation_amount = args.sponsor_negotiation_amount

        if args.status and args.status == "sponsor_accepted":
            adrequest.status = args.status

        if args.status and args.status == "sponsor_rejected":
            adrequest.status = args.status

        if args.status and args.status == "sponsor_negotiation":
            adrequest.status = args.status

        if args.status and args.status == "complete":
            adrequest.status = args.status
            adrequest.payment_amount = adrequest.sponsor_negotiation_amount

        db.session.commit()
        return {"message" : "adrequest updated successfully"}, 200



class InfluencerAdRequests(Resource):
    @auth_required('token')
    @roles_required('influencer')
    @marshal_with(marshal_fields_ad)
    def get(self, user_id):
        user = User.query.get(user_id)
        print("AABBCCZZ", user)
        if not user:
            print("BBCCZZ", user)
            return {"message" : "user not found"}, 400

        influencer = Influencer.query.filter_by(user_id=user_id).first()
        if not influencer:
            return {"message" : "user is not an influencer"}, 400
        
        adrequests = AdRequest.query.filter(and_(AdRequest.influencer_id == influencer.id, AdRequest.status.in_(["influencer_rejected", "sponsor_rejected", "complete"]) )).all()
        return adrequests
    
    @auth_required('token')
    @roles_required('influencer')
    def post(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        args = parser_ad.parse_args()

        if not(args.messages or args.requirements or args.payment_amount):
            return {"message" : "please enter some details"}, 400
        
        if not args.messages or not args.requirements or not args.payment_amount:
            return {"message" : "invalid input"}, 400
        
        influencer = Influencer.query.filter_by(user_id=user_id).first()
        if influencer:
            adrequest = AdRequest(messages = args.messages, requirements = args.requirements, payment_amount = args.payment_amount, influencer_negotiation_amount = args.payment_amount, status = args.status, campaign_id = args.campaign_id, influencer_id = influencer.id)
            
            db.session.add(adrequest)
            db.session.commit()

        return {"message" : "adrequest created successfully"}, 200
    

    @auth_required('token')
    @roles_required('influencer')
    def put(self, user_id, adrequest_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        args = parser_ad.parse_args()
        adrequest = AdRequest.query.get(adrequest_id)

        if not adrequest:
            return {"message" : "adrequest not found"}, 400
        
        if not(args.messages or args.requirements or args.influencer_negotiation_amount or args.status):
            return {"message" : "please enter some details"}, 400
        
        if args.messages:
            adrequest.messages = args.messages

        if args.requirements:
            adrequest.requirements = args.requirements

        if args.influencer_negotiation_amount:
            adrequest.influencer_negotiation_amount = args.influencer_negotiation_amount

        if args.status and args.status == "influencer_accepted":
            adrequest.status = args.status
            adrequest.payment_amount = adrequest.sponsor_negotiation_amount

        if args.status and args.status == "influencer_rejected":
            adrequest.status = args.status

        if args.status and args.status == "influencer_negotiation":
            adrequest.status = args.status

        if args.status and args.status == "influencer_complete":
            adrequest.status = args.status

        db.session.commit()
        return {"message" : "adrequest updated successfully"}, 200



class PendingSponsorRequests(Resource):
    @auth_required('token')
    @roles_required('sponsor')
    @marshal_with(marshal_fields_ad)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        sponsor = Sponsor.query.filter_by(user_id=user_id).first()
        adrequests = AdRequest.query.join(AdRequest.campaign).filter(and_(Campaign.sponsor_id == sponsor.id, AdRequest.status.in_(["pending_influencer_approval", "pending_sponsor_approval", "influencer_negotiation", "sponsor_negotiation"]) )).all()
        return adrequests


class PendingInfluencerRequests(Resource):
    @auth_required('token')
    @roles_required('influencer')
    @marshal_with(marshal_fields_ad)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400

        influencer = Influencer.query.filter_by(user_id=user_id).first()
        adrequests = AdRequest.query.filter(and_(AdRequest.influencer_id == influencer.id, AdRequest.status.in_(["pending_influencer_approval", "pending_sponsor_approval", "influencer_negotiation", "sponsor_negotiation"]) )).all()
        return adrequests

class AcceptedSponsorRequests(Resource):
    @auth_required('token')
    @roles_required('sponsor')
    @marshal_with(marshal_fields_ad)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        sponsor = Sponsor.query.filter_by(user_id=user_id).first()
        adrequests = AdRequest.query.join(AdRequest.campaign).filter(and_(Campaign.sponsor_id == sponsor.id, AdRequest.status.in_(["influencer_accepted", "sponsor_accepted", "influencer_complete"]) )).all()
        return adrequests

class AcceptedInfluencerRequests(Resource):
    @auth_required('token')
    @roles_required('influencer')
    @marshal_with(marshal_fields_ad)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        influencer = Influencer.query.filter_by(user_id=user_id).first()
        adrequests = AdRequest.query.filter(and_(AdRequest.influencer_id == influencer.id, AdRequest.status.in_(["influencer_accepted", "sponsor_accepted", "influencer_complete"]) )).all()
        return adrequests




class UserApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    @marshal_with(marshal_fields_user)
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        return user
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message" : "user not found"}, 400
        
        args = parser_user.parse_args()
        
        if not(args.password):
            return {"message" : "please enter some details"}, 400
        
        if args.password:
            user.password = hash_password(args['password'])

        db.session.commit()
        return {"message" : "details updated successfully"}, 200

    
class Users(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        users = User.query.all()
        return users
    
class ActiveUsers(Resource):
    @auth_required('token')
    @roles_required('admin')
    @marshal_with(marshal_fields_user)
    def get(self):
        active_users = User.query.filter_by(active=True).all()
        return active_users
    
class InactiveUsers(Resource):
    @auth_required('token')
    @roles_required('admin')
    @marshal_with(marshal_fields_user)
    def get(self):
        inactive_users = User.query.filter_by(active=False).all()
        return inactive_users

    
class InactiveSponsors(Resource):
    @auth_required('token')
    @roles_required('admin')
    @marshal_with(marshal_fields_user)
    def get(self):
        inactive_sponsors = User.query.filter(and_(User.active == False, User.roles.any(Role.name == 'sponsor'))).all()
        return inactive_sponsors

class FlagUser(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self, user_id):
        user = User.query.get(user_id)

        if not user:
            return {"message" : "user not found"}, 400
        if user.active == False:
            user.active = True
            db.session.commit()
            return {"message" : "user activated"}, 200
        if user.active == True:
            user.active = False
            db.session.commit()
            return {"message" : "user deactivated"}, 200
        return {"message" : "some error occured"}, 400
    

class SponsorApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'sponsor')
    @marshal_with(marshal_fields_sponsor)
    def get(self, sponsor_id):
        sponsor = Sponsor.query.get(sponsor_id)
        return sponsor
    
    @auth_required('token')
    @roles_accepted('sponsor')
    def put(self, sponsor_id):
        sponsor = Sponsor.query.get(sponsor_id)
         
        args = parser_sponsor.parse_args()

        if not(args.company_name or args.industry or args.budget):
            return {"message" : "please enter some details"}, 400
        
        if args.company_name:
            sponsor.company_name = args['company_name']

        if args.industry:
            sponsor.industry = args['industry']

        if args.budget:
            sponsor.budget = args['budget']

        db.session.commit()
        return {"message" : "Sponsor updated successfully"}, 200

    
class InfluencerApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'influencer')
    @marshal_with(marshal_fields_influencer)
    def get(self, influencer_id):
        influencer = Influencer.query.get(influencer_id)
        return influencer
    
    @auth_required('token')
    @roles_accepted('influencer')
    def put(self, influencer_id):
        influencer = Influencer.query.get(influencer_id)
         
        args = parser_influencer.parse_args()

        if not(args.name or args.category or args.niche or args.reach):
            return {"message" : "please enter some details"}, 400
        
        if args.name:
            influencer.name = args['name']

        if args.category:
            influencer.category = args['category']

        if args.niche:
            influencer.niche = args['niche']

        if args.reach:
            influencer.reach = args['reach']

        db.session.commit()
        return {"message" : "Influencer updated successfully"}, 200
    
class ActiveInfluencers(Resource):
    @auth_required('token')
    @roles_accepted('sponsor')
    @marshal_with(marshal_fields_influencer)
    def get(self):
        active_influencers = Influencer.query.join(Influencer.user).filter_by(active = True).all()
        return active_influencers        


class CacheTime(Resource):
    @cache.cached(timeout=5)
    def get(self):
        return jsonify({"time": datetime.datetime.now()})
    

class ExportCSV(Resource):
    def get(self, sponsor_id):
        task = create_csv.delay(sponsor_id)										
        return jsonify({'task_id': task.id})
    

class GetCsvStatus(Resource):
    def get(self, task_id):
        result = AsyncResult(task_id)										
    
        if result.ready():											
            return jsonify({'status': True})
        else:
            return jsonify({'status': False}), 405

class GetCSV(Resource):
    def get(self, task_id):
        result = AsyncResult(task_id)										
    
        if result.ready():											
            return send_file('./user-downloads/file.csv', mimetype='type/csv', as_attachment=True)
        else:
            return "task not ready", 405


class AdminSearch(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @marshal_with(marshal_fields_user)
    def post(self):
        data = request.get_json()
        if 'search_query' not in data and data['search_query'] == '':
            return "No Search query found"
        
        search_query = data['search_query']
        users = User.query.filter(or_(User.email.ilike(f'%{search_query}%'), User.active.ilike(f'%{search_query}%'))).all()
        return users

class SponsorSearch(Resource):
    @auth_required('token')
    @roles_accepted('sponsor')
    @marshal_with(marshal_fields_influencer)
    def post(self):
        data = request.get_json()
        if 'search_query' not in data and data['search_query'] == '':
            return "No Search query found"
        
        search_query = data['search_query']
        influencers = Influencer.query.filter(or_(Influencer.name.ilike(f'%{search_query}%'), Influencer.category.ilike(f'%{search_query}%'))).all()
        return influencers
    
class InfluencerSearch(Resource):
    @auth_required('token')
    @roles_accepted('influencer')
    @marshal_with(marshal_fields_campaign)
    def post(self):
        data = request.get_json()
        if 'search_query' not in data and data['search_query'] == '':
            return "No Search query found"
        
        search_query = data['search_query']
        campaigns = Campaign.query.filter(and_(Campaign.visibility == 'public', or_(Campaign.name.ilike(f'%{search_query}%'), Campaign.category.ilike(f'%{search_query}%')))).all()
        return campaigns
    








class Test(Resource):
    def get(self):
        return jsonify({'message': 'test message'})







api.add_resource(Test,'/test')
api.add_resource(CampaignApi, '/campaign', '/campaign/<int:campaign_id>')
api.add_resource(Campaigns, '/campaigns')
api.add_resource(PublicCampaigns, '/public_campaigns')
api.add_resource(PrivateCampaigns, '/private_campaigns')
api.add_resource(FlagCampaign,'/flagcampaign/<int:campaign_id>')
api.add_resource(SponsorCampaigns,'/sponsor_campaigns/<int:user_id>')
api.add_resource(AdRequestApi, '/adrequest', '/adrequest/<int:adrequest_id>')
api.add_resource(AdRequests, '/adrequests')
api.add_resource(SponsorAdRequests, '/sponsor_adrequests/<int:user_id>', '/sponsor_adrequests/<int:user_id>/<int:adrequest_id>')
api.add_resource(InfluencerAdRequests, '/influencer_adrequests/<int:user_id>', '/influencer_adrequests/<int:user_id>/<int:adrequest_id>')
api.add_resource(PendingSponsorRequests, '/pending_sponsor_requests/<int:user_id>')
api.add_resource(PendingInfluencerRequests, '/pending_influencer_requests/<int:user_id>')
api.add_resource(AcceptedSponsorRequests, '/accepted_sponsor_requests/<int:user_id>')
api.add_resource(AcceptedInfluencerRequests, '/accepted_influencer_requests/<int:user_id>')
api.add_resource(UserApi,'/user/<int:user_id>')
api.add_resource(Users,'/users')
api.add_resource(ActiveUsers,'/active_users')
api.add_resource(InactiveUsers,'/inactive_users')
api.add_resource(InactiveSponsors,'/inactive_sponsors')
api.add_resource(FlagUser,'/flaguser/<int:user_id>')
api.add_resource(SponsorApi,'/sponsor/<int:sponsor_id>')
api.add_resource(InfluencerApi,'/influencer/<int:influencer_id>')
api.add_resource(ActiveInfluencers,'/active_influencers')
api.add_resource(CacheTime,'/cachetime')
api.add_resource(ExportCSV,'/export_csv/<int:sponsor_id>')
api.add_resource(GetCSV,'/get_csv/<string:task_id>')
api.add_resource(AdminSearch,'/admin_search')
api.add_resource(SponsorSearch,'/sponsor_search')
api.add_resource(InfluencerSearch,'/influencer_search')
api.add_resource(GetCsvStatus,'/check_export/<string:task_id>')


