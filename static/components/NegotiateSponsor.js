const NegotiateSponsor = {
    template: `
        <div id="form-body" class="card shadow">
            <div v-if="response_success" class="alert alert-success text-center">
                {{ response_success }}
            </div>
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>

            <h2 class="mt-3 mb-3 text-center">Negotiate Sponsor</h2>
            <form @submit.prevent="submitInfo">
                <div class="mb-3">
                    <label for="messages" class="form-label">Messages</label>
                    <input type="text" class="form-control" id="messages" v-model="form.messages">
                </div>

                <div class="mb-3">
                    <label for="requirements" class="form-label">Requirements</label>
                    <input type="text" class="form-control" id="requirements" v-model="form.requirements">
                </div>

                <div class="mb-5">
                    <label for="sponsor_negotiation_amount" class="form-label">Negotiation Amount</label>
                    <input type="number" class="form-control" id="sponsor_negotiation_amount" v-model="form.sponsor_negotiation_amount">
                </div>

                <button type="submit" class="btn btn-primary mb-3">Submit</button>
            </form>
        </div>
    `,

    data() {
        return {
          form: {
            messages: null,
            requirements: null,
            sponsor_negotiation_amount: null
          },
          response_success: null,
          response_failure: null
        };
    },

    props: {
        adrequest_id: String
    },


    methods: {
        async submitInfo(){
            const sponsor_negotiation_amount = parseFloat(this.form.sponsor_negotiation_amount);
            const adrequest_id = parseInt(this.adrequest_id);

            const url = window.location.origin + `/api/sponsor_adrequests/` + this.$store.state.id + "/" + adrequest_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({messages: this.form.messages, requirements: this.form.requirements, sponsor_negotiation_amount: sponsor_negotiation_amount, status: "sponsor_negotiation"}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.response_success = data.message
            } else{
                console.error("Failed to Update Campaign:", res);
                const data = await res.json();
                console.log(data);
                this.response_failure = data.message
            }

            this.form.messages = ''
            this.form.requirements = ''
            this.form.sponsor_negotiation_amount = ''
            this.form.influencer_id = ''
        }
    }

}

export default NegotiateSponsor;