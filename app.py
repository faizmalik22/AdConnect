from flask import Flask
from application.configs import Config
import application.views as views
from application.extensions import db, security, cache
from flask_security import SQLAlchemyUserDatastore
from application.models import User, Role
import application.create_initial_data as create_initial_data
import application.resources as resources
from application.worker import celery_init_app
import flask_excel as excel
from application.tasks import daily_reminder, monthly_report
from celery.schedules import crontab

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    cache.init_app(app)

    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security.init_app(app, user_datastore)
    with app.app_context():
        db.create_all()
        create_initial_data.create_data(security)



    views.create_view(app, security)
    resources.api.init_app(app)
    return app


app = create_app()
celery_app = celery_init_app(app)
excel.init_excel(app)

@celery_app.on_after_configure.connect
def setup_periodic_task(sender, **kwargs):
    sender.add_periodic_task( 
				                crontab(hour=6, minute=50, day_of_month='*'), 
				                daily_reminder.s()
				            )
    sender.add_periodic_task( 
				                crontab(hour=5, minute=47, day_of_month=12), 
				                monthly_report.s()
				            )
    


if __name__ == "__main__":
    app.run()