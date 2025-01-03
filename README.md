# AdConnect

### Description
This project is an Influencer Engagement &amp; Sponsorship Coordination Platform designed to connect sponsors and influencers for mutually beneficial collaborations. Sponsors can create and manage campaigns, while influencers can accept or negotiate ad requests.

### Objectives
Develop an intuitive platform for sponsors and influencers to manage campaigns and ad requests. Implement role-based access, campaign management, and search functionalities. Integrate scheduled and
user-triggered backend jobs, and optimize performance with caching and API enhancements.

### Project Goals
Build a full-stack web application using Flask, VueJS, and SQLite, with a focus on role-based access control, campaign management, and backend job scheduling.

### Frameworks and libraries
- **Flask** : Micro web framework for building web applications in Python.
- **Flask-SQLAlchemy** : An extension for Flask that adds SQLAlchemy support.
- **Flask-RESTful** : An extension for Flask that simplifies the creation of REST APIs.
- **Flask-Security-Too** : An extension for adding security features and role-based access control.
- **Flask-Caching** : An extension for caching with Redis to improve performance.
- **Flask-Excel** : An extension for handling Excel files and exporting data.
- **VueJS** : A JavaScript framework for building the frontend user interface.
- **Vue Router** : A routing library for managing navigation in Vue applications.
- **Vuex** : A state management library for Vue applications.
- **Redis** : A key-value store used for caching and managing background jobs.
- **Celery** : An asynchronous task queue for handling background jobs.
- **Celery Beat** : A scheduler for periodic tasks with Celery.
- **MailHog** : A tool for testing email functionality during development.
- **Bootstrap** : A CSS framework for responsive design and styling.

### Procedures
- First created the flask app, integrated it with the configs, templates, models and views. Defined models using ER.
- Added VueJS and index.html template for rendering everything on a single page, added vuejs components.
- Added login and register endpoints, added vue router for route management and navigation guards.
- Added CRUD APIs in resources, used Flask Security to secure Endpoints, added parser and marshal fields to
manage the input and output of APIs
- Added sessionStorage to save login info, added vuex for state management.
- Added Celery for async jobs, celery beat for scheduling, used mailhog for testing emails.


# Features
### Admin
- can view campaigns, users, ad requests
- can flag campaigns, users

### Sponsor
- can view his/her campaigns, ad requests
- can create campaign, edit campaign, delete campaign
- can create ad request, negotiate with influencer, mark adrequest completed
- can search influencers

### Indluencer
- can view public campaigns
- can create ad requests, negotiate with sponsor, accept or reject ad request
- can search campaigns

### Other
- sponsor signup requires admin verification
- triggering asynchronous backend jobs manually by sponsor.
- sending daily reminders to influencers for pending ad requests
- sending monthly report of campaigns to sponsors by mail, in html form.
- caching endponts for storing frequently accessed data, improves performance and efficiency


# Data Models
The data models are implemented in SQLite using Flask SQLAlchemy.
- **User**: Representing all users with attributes like id, email, password, active, fs_uniquifier.
- **Role**: For storing roles information with attributes like id, name, description.
- **UserRoles**: Associate table for many to many relationship between users and roles.
- **Sponsor**: For storing sponsors info with attributes like id, company_name, industry, budget, user_id.
- **Influencer**: For storing influencers info with attributes like id, name, category, niche, reach, user_id.
- **Campaign**: For storing information about campaigns with attributes like id, name, image_name, description, category, start_date, end_date, visibility, goals, sponsor_id.
- **AdRequest**: Represents transactions of ad requests using attributes like id, messages, requirements, payment_amount, sponsor_negotiation_amount, influencer_negotiation_amount, status, campaign_id, influencer_id.

# API Endpoints
Use Prefix '/api' for all endpoints, token authentication is required based on the user role.

```
'/campaign', '/campaign/<int:campaign_id>'
'/campaigns'
'/public_campaigns'
'/private_campaigns'
'/flagcampaign/<int:campaign_id>'
'/sponsor_campaigns/<int:user_id>'
'/adrequest', '/adrequest/<int:adrequest_id>'
'/adrequests'
'/sponsor_adrequests/<int:user_id>', '/sponsor_adrequests/<int:user_id>/<int:adrequest_id>'
'/influencer_adrequests/<int:user_id>', '/influencer_adrequests/<int:user_id>/<int:adrequest_id>'
'/pending_sponsor_requests/<int:user_id>'
'/pending_influencer_requests/<int:user_id>'
'/accepted_sponsor_requests/<int:user_id>'
'/accepted_influencer_requests/<int:user_id>'
'/user/<int:user_id>'
'/users'
'/active_users'
'/inactive_users'
'/inactive_sponsors'
'/flaguser/<int:user_id>'
'/sponsor/<int:sponsor_id>'
'/influencer/<int:influencer_id>'
'/active_influencers'
'/cachetime'
'/export_csv/<int:sponsor_id>'
'/get_csv/<string:task_id>'
'/admin_search'
'/sponsor_search'
'/influencer_search'
'/check_export/<string:task_id>'
```

# ➢ Conclusion
- This project successfully developed an efficient platform for managing influencer and sponsor interactions, leveraging modern technologies such as Flask, VueJS, Redis and Celery.
- By implementing robust features for campaign management, role-based access control, and background job scheduling, the platform enhances user experience and operational efficiency.
- The use of caching and asynchronous processing ensures scalability and performance, making the application well-suited for handling high volumes of data and user activity.
