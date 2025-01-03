// const Test = {
//     template: `
//         <div>
//             <h1>TEST PAGE</h1>
//             <img :src="image_url" alt="">
//         </div>
//     `,

//     data(){
//         return {
//             image_url: '/static/images/1.jpg'
//         }
//     }

// }

// export default Test;






const Test = {
    template: `
        <div>
            <h1>DASH ADMIN</h1>


            <div class="campaign-container">
                <div v-for="campaign in campaigns" class="card campaign-card" style="width: 30rem;">
                    <img :src="image_url + campaign.id +'.jpg'" height="200px" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{campaign.name}}</h5>
                        <p class="card-text"></p>
                        <button type="button" class="btn btn-success">View</button>
                        <button type="button" class="btn btn-warning">Flag</button>  
                        <button type="button" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>















            <h1>Public Campaigns</h1>
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
                            <th scope="col" class="text-center">Flag</th>
                            <th scope="col" class="text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in public_campaigns">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{campaign.name}}</td>
                            <td>{{campaign.category}}</td>
                            <td>{{campaign.visibility}}</td>
                            <td>{{campaign.budget}}</td>

                            <td class="text-center"><a href=""><button type="button" class="btn btn-success">View</button></a></td>
                            <td class="text-center"><button type="button" @click=flagCampaign(campaign.id) class="btn btn-warning"> Flag </button></td>
                            <td class="text-center"><button type="button" @click=deleteCampaign(campaign.id) class="btn btn-danger"> Delete </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>



            <h1>Private Campaigns</h1>
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
                            <th scope="col" class="text-center">Flag</th>
                            <th scope="col" class="text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in private_campaigns">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{campaign.name}}</td>
                            <td>{{campaign.category}}</td>
                            <td>{{campaign.visibility}}</td>
                            <td>{{campaign.budget}}</td>

                            <td class="text-center"><a href=""><button type="button" class="btn btn-success">View</button></a></td>
                            <td class="text-center"><button type="button" @click=flagCampaign(campaign.id) class="btn btn-warning"> Flag </button></td>
                            <td class="text-center"><button type="button" @click=deleteCampaign(campaign.id) class="btn btn-danger"> Delete </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>




        </div>
    `,

    data() {
        return {
            campaigns: [],
            public_campaigns: [],
            private_campaigns: [],
            image_url: '/static/images/'
        }
    },

    async mounted(){
        this.getCampains()
        this.getPublicCampains()
        this.getPrivateCampains()

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

        async getPrivateCampains() {
            const url = window.location.origin + `/api/private_campaigns`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.private_campaigns = data
                console.log(data);
            } else{
                console.error("Failed to Get Private Campaign:", res);
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

export default Test;