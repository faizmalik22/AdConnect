const HomeInfluencer = {
    template: `
        <div>
            <h1>HOME INFLUENCER</h1>

            <div class="campaign-container">
                <div v-for="campaign in public_campaigns" class="card campaign-card" style="width: 30rem;">
                    <img :src="image_url + campaign.image_name" height="200px" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{campaign.name}}</h5>
                        <p class="card-text"></p>
                        <router-link :to="{name: 'view-campaign-influencer', params: {campaign_id: String(campaign.id)}}" class="btn btn-success"> View </router-link>
                        <router-link :to="{name: 'create-adrequest-influencer', params: {campaign_id: String(campaign.id)}}" class="btn btn-primary"> Create AdRequest </router-link>
                    </div>
                </div>
            </div>


        </div>
    `,

    data() {
        return {
            public_campaigns: [],
            image_url: '/static/images/'
        }
    },

    async mounted(){
        this.getPublicCampains()

    },

    methods: {

        async getPublicCampains() {
            const url = window.location.origin + `/api/public_campaigns`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.public_campaigns = data
                console.log(data);
            } else{
                console.error("Failed to Get Public Campaign:", res);
            }

        },

    }



}

export default HomeInfluencer;