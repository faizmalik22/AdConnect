const ViewCampaignInfluencer = {
    template: `
        <div>
            <div class="mt-5">
                <img :src="image_url + campaign_id +'.jpg'" height="300px" class="rounded float-start view-campaign-image" alt="...">

                <div>
                    <h2>Campaign Name : {{campaign.name}}</h2>
                    <div class="campaign-info">
                        <p>Description : {{campaign.description}} </p>
                        <p>Visibility :  {{campaign.visibility}}</p>
                        <p>Budget : {{campaign.budget}} </p>
                        <p>Category : {{campaign.category}} </p>
                        
                    </div>
                </div>

                <div class="view-campaign-clear">
                    <h2></h2>
                </div>
            </div>


        </div>
    `,

    data() {
        return {
            image_url: '/static/images/',
            campaign: {}
        }
    },

    computed: {
        campaign_id(){
            return this.$route.params.campaign_id
        }

    },

    async mounted(){
        this.getCampain()
    },

    methods: {
        async getCampain() {
            const url = window.location.origin + `/api/campaign/` + this.campaign_id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.campaign = data
                console.log(data);
            } else{
                console.error("Failed to Get Campaign:", res);
            }

        },
    }

}

export default ViewCampaignInfluencer;