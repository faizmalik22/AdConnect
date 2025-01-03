const HomeSponsor = {
    template: `
        <div>
            <h1>HOME SPONSOR</h1>

            <div class="campaign-container">
                <div v-for="campaign in sponsor_campaigns" class="card campaign-card" style="width: 30rem;">
                    <img :src="image_url + campaign.image_name" height="200px" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{campaign.name}}</h5>
                        <p class="card-text"></p>
                        <router-link :to="{name: 'view-campaign-sponsor', params: {campaign_id: String(campaign.id)}}" class="btn btn-success"> View </router-link>
                        <router-link :to="{name: 'editcampaign', params: {campaign_id: String(campaign.id)}}" class="btn btn-secondary"> Edit</router-link>
                        <button type="button" @click=deleteCampaign(campaign.id) class="btn btn-danger">Delete</button>
                        <router-link v-if="campaign.visibility === 'public'" :to="{name: 'create-adrequest-sponsor', params: {campaign_id: String(campaign.id)}}" class="btn btn-primary"> Create AdRequest </router-link>

                    </div>
                </div>
            </div>


        </div>
    `,

    data() {
        return {
            sponsor_campaigns: [],
            image_url: '/static/images/'
        }
    },


    async mounted(){
        this.getSponsorCampains()

    },

    methods: {
        async getSponsorCampains() {
            const url = window.location.origin + `/api/sponsor_campaigns/` + this.$store.state.id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.sponsor_campaigns = data
                console.log(data);
            } else{
                console.error("Failed to Add Campaign:", res);
            }

        },

        async deleteCampaign(campaign_id) {
            const url = window.location.origin + `/api/campaign/` + campaign_id;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.getSponsorCampains()
            } else{
                console.error("Failed to Add Campaign:", res);
            }
        },

          
    }
}

export default HomeSponsor;