const HomeAdmin = {
    template: `
        <div>
            <h1>HOME ADMIN</h1>


            <div class="campaign-container">
                <div v-for="campaign in campaigns" class="card campaign-card" style="width: 30rem;">
                    <img :src="image_url + campaign.image_name" height="200px" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{campaign.name}}</h5>
                        <p class="card-text"></p>
                        <router-link :to="{name: 'view-campaign-admin', params: {campaign_id: String(campaign.id)}}" class="btn btn-success"> View </router-link>
                        <button type="button" @click=flagCampaign(campaign.id) class="btn btn-warning"> Flag </button>
                        <button type="button" @click=deleteCampaign(campaign.id) class="btn btn-danger"> Delete </button>

                    </div>
                </div>
            </div>


        </div>
    `,

    data() {
        return {
            campaigns: [],
            image_url: '/static/images/'
        }
    },

    async mounted(){
        this.getCampains()

    },

    methods: {
        async getCampains() {
            const url = window.location.origin + `/api/campaigns`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.campaigns = data
                console.log(data);
            } else{
                console.error("Failed to Get Campaign:", res);
            }

        },

        async flagCampaign(campaign_id) {
            const url = window.location.origin + `/api/flagcampaign/` + campaign_id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.getCampains()
                this.getPublicCampains()
                this.getPrivateCampains()
            } else{
                console.error("Failed to Flag Campaign:", res);
                const data = await res.json();
                console.log(data.message);
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
                this.getCampains()
                this.getPublicCampains()
                this.getPrivateCampains()
            } else{
                console.error("Failed to Delete Campaign:", res);
                const data = await res.json();
                console.log(data.message);
            }
        },
    }

}

export default HomeAdmin;