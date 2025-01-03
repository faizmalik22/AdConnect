const RequestsSponsor = {
    template: `
        <div>

            <h1>Pending AdRequests Sponsor</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">AdRequest ID</th>
                            <th scope="col">Messages</th>
                            <th scope="col">Requirement</th>
                            <th scope="col">Payment Amount</th>
                            <th scope="col">Sponsor Negotiation Amount</th>
                            <th scope="col">Influencer Negotiation Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Campaign Name</th>
                            <th scope="col">Sponsor Name</th>
                            <th scope="col">Influencer Name</th>

                            <th scope="col">Negotiate</th>
                            <th scope="col">Accept</th>
                            <th scope="col">Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(adrequest, index) in pending_requests_sponsor">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{adrequest.id}}</td>
                            <td>{{adrequest.messages}}</td>
                            <td>{{adrequest.requirements}}</td>
                            <td> &#8377 {{adrequest.payment_amount}}</td>
                            <td> &#8377 {{adrequest.sponsor_negotiation_amount}}</td>
                            <td> &#8377 {{adrequest.influencer_negotiation_amount}}</td>
                            <td>{{adrequest.status}}</td>
                            <td>{{adrequest.campaign.name}}</td>
                            <td>{{adrequest.campaign.sponsor.company_name}}</td>
                            <td>{{adrequest.influencer.name}}</td>

                            <td><router-link :to="{name: 'negotiate-sponsor', params: {adrequest_id: String(adrequest.id)}}" class="btn btn-warning"> Negotiate </router-link></td>
                            <td><button v-if="['pending_sponsor_approval'].includes(adrequest.status)" type="button" @click=acceptAdRequest(adrequest.id) class="btn btn-success">Accept</button></td>
                            <td><button v-if="['pending_sponsor_approval'].includes(adrequest.status)" type="button" @click=rejectAdRequest(adrequest.id) class="btn btn-danger">Reject</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <h1>Accepted AdRequests Sponsor</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">AdRequest ID</th>
                            <th scope="col">Messages</th>
                            <th scope="col">Requirement</th>
                            <th scope="col">Payment Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Campaign Name</th>
                            <th scope="col">Sponsor Name</th>
                            <th scope="col">Influencer Name</th>

                            
                            <th scope="col">Complete</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(adrequest, index) in accepted_requests_sponsor">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{adrequest.id}}</td>
                            <td>{{adrequest.messages}}</td>
                            <td>{{adrequest.requirements}}</td>
                            <td> &#8377 {{adrequest.payment_amount}}</td>
                            <td>{{adrequest.status}}</td>
                            <td>{{adrequest.campaign.name}}</td>
                            <td>{{adrequest.campaign.sponsor.company_name}}</td>
                            <td>{{adrequest.influencer.name}}</td>

                            
                            <td><button type="button" @click=completeAdRequest(adrequest.id) class="btn btn-primary">Complete</button></td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>




        </div>
    `,

    data() {
        return {
            pending_requests_sponsor: [],
            accepted_requests_sponsor: []
        }
    },

    async mounted(){
        this.getPendingRequests()
        this.getAcceptedRequests()

    },

    methods: {
        async getPendingRequests() {
            const url = window.location.origin + `/api/pending_sponsor_requests/` + this.$store.state.id;
            
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.pending_requests_sponsor = data
                console.log(data);
            } else{
                console.error("Failed to Get AdRequests:", res);
                const data = await res.json();
                console.log(data.message);
            }

        },

        async getAcceptedRequests() {
            const url = window.location.origin + `/api/accepted_sponsor_requests/` + this.$store.state.id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.accepted_requests_sponsor = data
                console.log(data);
            } else{
                console.error("Failed to Get AdRequests:", res);
                const data = await res.json();
                console.log(data.message);
            }
        },

        async acceptAdRequest(adrequest_id) {
            const url = window.location.origin + `/api/sponsor_adrequests/` + this.$store.state.id + "/" + adrequest_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({status: "sponsor_accepted"}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.getPendingRequests()
                this.getAcceptedRequests()
            } else{
                console.error("Failed to Accept Ad Request:", res);
                const data = await res.json();
                console.log(data.message);
            }
        },

        async rejectAdRequest(adrequest_id) {
            const url = window.location.origin + `/api/sponsor_adrequests/` + this.$store.state.id + "/" + adrequest_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({status: "sponsor_rejected"}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.getPendingRequests()
                this.getAcceptedRequests()
            } else{
                console.error("Failed to Reject Ad Request:", res);
                const data = await res.json();
                console.log(data.message);
            }
        },

        async completeAdRequest(adrequest_id) {
            const url = window.location.origin + `/api/sponsor_adrequests/` + this.$store.state.id + "/" + adrequest_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({status: "complete"}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.getPendingRequests()
                this.getAcceptedRequests()
            } else{
                console.error("Failed to Update Ad Request:", res);
                const data = await res.json();
                console.log(data.message);
            }
        }



    }

}

export default RequestsSponsor;