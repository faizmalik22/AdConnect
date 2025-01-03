const CreateAdRequestSponsor = {
    template: `
        <div id="form-body" class="card shadow">
            <div v-if="response_success" class="alert alert-success text-center">
                {{ response_success }}
            </div>
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>

            <h2 class="mt-3 mb-3 text-center">Create AdRequest</h2>
            <form @submit.prevent="submitInfo">
                <div class="mb-3">
                    <label for="messages" class="form-label">Messages</label>
                    <input type="text" class="form-control" id="messages" v-model="form.messages">
                </div>

                <div class="mb-3">
                    <label for="requirements" class="form-label">Requirements</label>
                    <input type="text" class="form-control" id="requirements" v-model="form.requirements">
                </div>

                <div class="mb-3">
                    <label for="payment_amount" class="form-label">Payment Amount</label>
                    <input type="number" class="form-control" id="payment_amount" v-model="form.payment_amount">
                </div>

                <div class="mb-5">
                    <label for="influencer_id" class="form-label">Influencer ID</label>
                    <input type="number" class="form-control" id="influencer_id" v-model="form.influencer_id">
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
            payment_amount: null,
            influencer_id: null
          },
          response_success: null,
          response_failure: null
        };
    },

    props: {
        campaign_id: String
    },

    methods: {
        async submitInfo(){
            const payment_amount = parseFloat(this.form.payment_amount);
            const campaign_id = parseInt(this.campaign_id)
            const influencer_id = parseInt(this.form.influencer_id)

            const url = window.location.origin + `/api/sponsor_adrequests/` + this.$store.state.id;
            const res = await fetch(url, {
                method: "POST",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({messages: this.form.messages, requirements: this.form.requirements, payment_amount: payment_amount, sponsor_negotiation_amount: payment_amount, status: "pending_influencer_approval", campaign_id: campaign_id, influencer_id: influencer_id}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.response_success = data.message
            } else{
                console.error("Failed to Add Campaign:", res);
                const data = await res.json();
                console.log(data);
                this.response_failure = data.message
            }

            this.form.messages = ''
            this.form.requirements = ''
            this.form.payment_amount = ''
            this.form.influencer_id = ''
        }
    }

}

export default CreateAdRequestSponsor;