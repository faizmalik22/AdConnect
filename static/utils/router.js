import Test from '../pages/Test.js';
import Home from '../pages/Home.js';
import Signup from '../pages/Signup.js';
import Login from '../pages/Login.js';
import ProfileAdmin from '../pages/ProfileAdmin.js';
import ProfileSponsor from '../pages/ProfileSponsor.js';
import ProfileInfluencer from '../pages/ProfileInfluencer.js';
import DashboardAdmin from '../pages/DashboardAdmin.js';
import DashboardSponsor from '../pages/DashboardSponsor.js';
import DashboardInfluencer from '../pages/DashboardInfluencer.js';
import Unauthorized from '../pages/Unauthorized.js'
import AddCampaign from '../components/AddCampaign.js';
import EditCampaign from '../components/EditCampaign.js';
import UsersAdmin from '../pages/UsersAdmin.js';
import AdRequestsAdmin from '../pages/AdrequestsAdmin.js';
import AdRequestsSponsor from '../pages/AdRequestsSponsor.js';
import AdRequestsInfluencer from '../pages/AdRequestsInfluencer.js';
import RequestsAdmin from '../pages/RequestsAdmin.js';
import RequestsSponsor from '../pages/RequestsSponsor.js';
import RequestsInfluencer from '../pages/RequestsInfluencer.js';
import CreateAdRequestSponsor from '../components/CreateAdRequestSponsor.js';
import CreateAdRequestInfluencer from '../components/CreateAdRequestInfluencer.js';
import NegotiateSponsor from '../components/NegotiateSponsor.js';
import NegotiateInfluencer from '../components/NegotiateInfluencer.js';
import ViewCampaignAdmin from '../components/ViewCampaignAdmin.js';
import ViewCampaignSponsor from '../components/ViewCampaignSponsor.js';
import ViewCampaignInfluencer from '../components/ViewCampaignInfluencer.js';
import AdminSearch from '../pages/AdminSearch.js';

import store from './store.js';
import SponsorSearch from '../pages/SponsorSearch.js';
import InfluencerSearch from '../pages/InfluencerSearch.js';
import InfluencersSponsor from '../pages/InfluencersSponsor.js';
import EditProfileAdmin from '../components/EditProfileAdmin.js';
import EditProfileSponsor from '../components/EditProfileSponsor.js';
import EditProfileInfluencer from '../components/EditProfileInfluencer.js';
import HomeAdmin from '../pages/HomeAdmin.js';
import HomeSponsor from '../pages/HomeSponsor.js';
import HomeInfluencer from '../pages/HomeInfluencer.js';








const routes = [
    { path : '/test', component: Test},
    { path : '/', component: Home},
    { path : '/signup', component: Signup, meta: { afterLogin: true}},
    { path : '/login', component: Login, meta: { afterLogin: true}},
    { path : '/profile-admin', component: ProfileAdmin, meta: { requiresLogin: true}},
    { path : '/profile-sponsor', component: ProfileSponsor, meta: { requiresLogin: true}},
    { path : '/profile-influencer', component: ProfileInfluencer, meta: { requiresLogin: true}},
    { path : '/dashboard-admin', component: DashboardAdmin, meta: { requiresLogin: true, role: "admin" }},
    { path : '/dashboard-sponsor', component: DashboardSponsor, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/dashboard-influencer', component: DashboardInfluencer, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/unauthorized', component: Unauthorized},
    { path : '/addcampaign', component: AddCampaign, name: 'addcampaign', meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/editcampaign/:campaign_id', component: EditCampaign, name: 'editcampaign', meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/users', component: UsersAdmin, meta: { requiresLogin: true, role: "admin" }},
    { path : '/adrequests-admin', component: AdRequestsAdmin, meta: { requiresLogin: true, role: "admin" }},
    { path : '/adrequests-sponsor', component: AdRequestsSponsor, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/adrequests-influencer', component: AdRequestsInfluencer, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/requests-admin', component: RequestsAdmin, meta: { requiresLogin: true, role: "admin" }},
    { path : '/requests-sponsor', component: RequestsSponsor, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/requests-influencer', component: RequestsInfluencer, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/create-adrequest-sponsor/:campaign_id', component: CreateAdRequestSponsor, name: 'create-adrequest-sponsor', props: true, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/create-adrequest-influencer/:campaign_id', component: CreateAdRequestInfluencer, name: 'create-adrequest-influencer', props: true, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/negotiate-sponsor/:adrequest_id', component: NegotiateSponsor, name: 'negotiate-sponsor', props: true, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/negotiate-influencer/:adrequest_id', component: NegotiateInfluencer, name: 'negotiate-influencer', props: true, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/view-campaign-admin/:campaign_id', component: ViewCampaignAdmin, name: 'view-campaign-admin', meta: { requiresLogin: true, role: "admin" }},
    { path : '/view-campaign-sponsor/:campaign_id', component: ViewCampaignSponsor, name: 'view-campaign-sponsor', meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/view-campaign-influencer/:campaign_id', component: ViewCampaignInfluencer, name: 'view-campaign-influencer', props: true, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/admin-search', component: AdminSearch, name: 'admin-search', props: true, meta: { requiresLogin: true, role: "admin" }},
    { path : '/sponsor-search', component: SponsorSearch, name: 'sponsor-search', props: true, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/influencer-search', component: InfluencerSearch, name: 'influencer-search', props: true, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/active-influencers', component: InfluencersSponsor, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/edit-admin', component: EditProfileAdmin, meta: { requiresLogin: true, role: "admin" }},
    { path : '/edit-sponsor', component: EditProfileSponsor, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/edit-influencer', component: EditProfileInfluencer, meta: { requiresLogin: true, role: "influencer" }},
    { path : '/home-admin', component: HomeAdmin, meta: { requiresLogin: true, role: "admin" }},
    { path : '/home-sponsor', component: HomeSponsor, meta: { requiresLogin: true, role: "sponsor" }},
    { path : '/home-influencer', component: HomeInfluencer, meta: { requiresLogin: true, role: "influencer" }},

    

];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path: '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            next({path: '/unauthorized'})
        }
    }

    if (to.matched.some(record => record.meta.afterLogin)){
        if (store.state.loggedIn){
            next({path: '/profile'})
        }
    }

    next();
});

export default router;