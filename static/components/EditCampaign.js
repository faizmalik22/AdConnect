const EditCampaign = {
    template: `
        <div id="form-body" class="card shadow">
            <div v-if="response_success" class="alert alert-success text-center">
                {{ response_success }}
            </div>
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>
            <h2 class="mt-3 mb-4 text-center">Edit Campaign</h2>
            <form @submit.prevent="submitInfo">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" v-model="form.name">
                </div>

                <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <input type="text" class="form-control" id="category" v-model="form.category">
                </div>

                <div class="mb-3">
                    <label for="budget" class="form-label">Budget</label>
                    <input type="number" class="form-control" id="budget" v-model="form.budget">
                </div>



                <div class="mb-5 ">
                    <label for="visibility" class="form-label">Visibility</label>
                    <select v-model="form.visibility" class="form-control" id="visibility">
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary mb-3">Submit</button>
            </form>
        </div>
    `,

    data() {
        return {
          form: {
            name: null,
            category: null,
            budget: null,
            visibility: "private"
          },
          response_success: null,
          response_failure: null
        };
    },

    computed: {
        // sponsor_id() {
        //   return this.$route.params.sponsor_id;
        // },

        campaign_id() {
            return this.$route.params.campaign_id
        }

    },

    methods: {
        async submitInfo(){
            const budget = parseFloat(this.form.budget);

            const url = window.location.origin + `/api/campaign/` + this.campaign_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({name: this.form.name, category: this.form.category, budget: budget, visibility: this.form.visibility}),
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

            this.form.name = ''
            this.form.category = ''
            this.form.budget = ''
        }
    }

}

export default EditCampaign;