const InfluencerSearch = {
    template:`
        <div>
            
            <h1>Campaigns</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Campaign Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Visibility</th>
                            <th scope="col">Budget</th>

                            <th scope="col" class="text-center">View</th>
                            <th scope="col">Create AdRequest</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in search_result">
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
    
    props: {
        search_result: Array
    },

    
}

export default InfluencerSearch;