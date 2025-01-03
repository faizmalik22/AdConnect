const AdRequestsSponsor = {
    template: `
        <div>

            <h1>Adrequests Sponsor</h1>
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(adrequest, index) in adrequests">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{adrequest.id}}</td>
                            <td>{{adrequest.messages}}</td>
                            <td>{{adrequest.requirements}}</td>
                            <td> &#8377 {{adrequest.payment_amount}}</td>
                            <td>{{adrequest.status}}</td>
                            <td>{{adrequest.campaign.name}}</td>
                            <td>{{adrequest.campaign.sponsor.company_name}}</td>
                            <td>{{adrequest.influencer.name}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    `,

    data() {
        return {
            adrequests: [],
        }
    },

    async mounted(){
        this.getAdRequests()

    },

    methods: {
        async getAdRequests() {
            const url = window.location.origin + `/api/sponsor_adrequests/` + this.$store.state.id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.adrequests = data
                console.log(data);
            } else{
                console.error("Failed to Get AdRequests:", res);
                const data = await res.json();
                console.log(data.message);
            }

        },
    }

}

export default AdRequestsSponsor;