const InfluencersSponsor = {
    template: `
        <div>
            <h1>Influencers</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Niche</th>
                            <th scope="col">Reach</th>
                            <th scope="col">Influencer ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(influencer, index) in active_influencers">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{influencer.name}}</td>
                            <td>{{influencer.category}}</td>
                            <td>{{influencer.niche}}</td>
                            <td>{{influencer.reach}}</td>
                            <td>{{influencer.id}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    
    `,

    data() {
        return {
            active_influencers: []
        }
    },

    async mounted(){
        this.getActiveInfluencers()

    },

    methods: {
        async getActiveInfluencers() {
            const url = window.location.origin + `/api/active_influencers`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.active_influencers = data
                console.log(data);
            } else{
                console.error("Failed to Get Active Influencers:", res);
            }

        },
    }






}

export default InfluencersSponsor