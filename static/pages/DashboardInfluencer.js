const DashboardInfluencer = {
    template: `
        <div>


            <h1>Public Campaigns</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Section Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Visibility</th>
                            <th scope="col">Budget</th>

                            <th scope="col" class="text-center">View</th>
                            <th scope="col">Create AdRequest</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in public_campaigns">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{campaign.name}}</td>
                            <td>{{campaign.category}}</td>
                            <td>{{campaign.visibility}}</td>
                            <td>{{campaign.budget}}</td>

                            <td><router-link :to="{name: 'view-campaign-influencer', params: {campaign_id: String(campaign.id)}}" class="btn btn-success"> View </router-link></td>
                            <td><router-link :to="{name: 'create-adrequest-influencer', params: {campaign_id: String(campaign.id)}}" class="btn btn-primary"> Create AdRequest </router-link></td>
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>
    `,

    data() {
        return {
            public_campaigns: [],
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

export default DashboardInfluencer;