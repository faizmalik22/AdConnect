const DashboardSponsor = {
    template: `
        <div>
            <h1>My Campaigns</h1>

            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Campaign Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Budget</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Visibility</th>

                            <th scope="col">View</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                            <th scope="col">Create AdRequest</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in sponsor_campaigns">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{campaign.name}}</td>
                            <td>{{campaign.category}}</td>
                            <td>{{campaign.budget}}</td>
                            <td>{{campaign.end_date}}</td>
                            <td>{{campaign.visibility}}</td>

                            <td><router-link :to="{name: 'view-campaign-sponsor', params: {campaign_id: String(campaign.id)}}" class="btn btn-success"> View </router-link></td>
                            <td><router-link :to="{name: 'editcampaign', params: {user_id: state.id, campaign_id: campaign.id}}" class="btn btn-secondary"> Edit</router-link></td>
                            <td><button type="button" @click=deleteCampaign(campaign.id) class="btn btn-danger">Delete</button></td>
                            <td><router-link v-if="campaign.visibility === 'public'" :to="{name: 'create-adrequest-sponsor', params: {campaign_id: String(campaign.id)}}" class="btn btn-primary"> Create AdRequest </router-link></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <router-link :to="{name: 'addcampaign', params: {user_id: state.id}}" class="btn btn-primary"> Add Campaign </router-link>
            <button v-if="!export_status" type="button" @click=startExport class="btn btn-primary">Export CSV</button>
            <p v-if="export_status === 'started'">Export Started, Waiting for Completion</p>
            <button v-if="export_status === 'completed'" type="button" @click=downloadFile class="btn btn-primary">Download CSV</button>

        </div>
    `,

    data() {
        return {
            sponsor_campaigns: [],
            export_status: null,
            task_id: null,
            interval_id: null,
        }
    },

    computed: {
        state(){
          return this.$store.state
        }
    },

    async mounted(){
        this.getSponsorCampains()

    },

    methods: {
        async getSponsorCampains() {
            const url = window.location.origin + `/api/sponsor_campaigns/` + this.state.id;
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

        async startExport(){
            const url = window.location.origin + `/api/export_csv/` + this.$store.state.sponsor_id;
            
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.task_id = data.task_id
                this.export_status = 'started'
                this.checkExportStatus()
            } else{
                console.error("Failed to Download Campaignss:", res);
            }

        },


        async checkExportStatus() {
            const url = window.location.origin + `/api/check_export/` + this.task_id;
            
            this.interval_id = setInterval(() => {
                fetch(url, {
                    method: 'GET',
                    headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"}
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status == true) {
                        clearInterval(this.interval_id);
                        // this.downloadFile();
                        this.export_status = 'completed'
                    }
                })
                .catch(error => {
                    console.error('Error checking export status:', error);
                    clearInterval(this.checkInterval);
                });
            }, 2000);


          },

        async downloadFile(){
            const url = window.location.origin + `/api/get_csv/` + this.task_id;
            
            const response = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });

            if (response.ok){
                const blob = await response.blob();
    
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'file.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
            } else{
                console.error("Failed to Download Campaignss:", res);
            }
            
            
        },















          
    }
}

export default DashboardSponsor;