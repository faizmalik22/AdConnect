from celery import shared_task
import flask_excel as excel
from .models import Campaign, Sponsor,  Influencer, AdRequest
from .mail_service import send_email

from flask import render_template
from sqlalchemy import and_, or_

@shared_task(ignore_result=False)
def create_csv(sponsor_id):
    campaigns = Campaign.query.filter_by(sponsor_id = sponsor_id).all()
    csv_out = excel.make_response_from_query_sets(campaigns, ['name', 'category', 'budget'], 'csv')
    with open('./user-downloads/file.csv', 'wb') as file:
        file.write(csv_out.data)
    return 'WRITTEN SUCCESSFULLY'


@shared_task(ignore_result=True)
def daily_reminder():
    influencers = Influencer.query.all()
    for influencer in influencers:
        pending_adrequests = AdRequest.query.filter(and_(AdRequest.influencer_id == influencer.id, AdRequest.status.in_(["pending_influencer_approval", "pending_sponsor_approval", "influencer_negotiation", "sponsor_negotiation"]))).all()
        if pending_adrequests:
            subject = "Pending Adrequests"
            message = "You have pending adrequests"
        else:
            subject = "Visit Adconnect"
            message = "Visit AdConnect to find Sponsors"
        send_email(influencer.user.email, subject, message)
    pass

@shared_task(ignore_result=True)
def monthly_report():
    sponsors = Sponsor.query.all()
    for sponsor in sponsors:
        campaigns = Campaign.query.filter_by(sponsor_id = sponsor.id).all()
        message = render_template('monthly_report.html', data=campaigns)
        send_email(sponsor.user.email, 'Monthly Report', message)