const AddCampaign = {
    template: `
        <div id="form-body" class="card shadow">
            <div v-if="response_success" class="alert alert-success text-center">
                {{ response_success }}
            </div>
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>
            <h2 class="mt-3 mb-3 text-center">Add New Campaign</h2>
            <form @submit.prevent="submitInfo">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" v-model="form.name">
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <input type="text" class="form-control" id="description" v-model="form.description">
                </div>

                <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <input type="text" class="form-control" id="category" v-model="form.category">
                </div>

                <div class="mb-3">
                    <label for="budget" class="form-label">Budget</label>
                    <input type="number" class="form-control" id="budget" v-model="form.budget">
                </div>

                <div class="mb-5">
                    <label for="duration" class="form-label">Duration</label>
                    <input type="number" class="form-control" id="duration" v-model="form.duration">
                </div>

                <button type="submit" class="btn btn-primary mb-3">Submit</button>
            </form>
        </div>
    `,

    data() {
        return {
          form: {
            name: null,
            description: null,
            category: null,
            budget: null,
            goals: null,
            duration: null
          },
          response_success: null,
          response_failure: null
        };
    },

    computed: {
        // sponsor_id() {
        //   return this.$route.params.sponsor_id;
        // }
    },

    methods: {
        async submitInfo(){
            const budget = parseFloat(this.form.budget);

            const sponsor_url = window.location.origin + `/api/sponsor/` + this.$store.state.sponsor_id;
            const sponsor_res = await fetch(sponsor_url, {method: "GET", headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"}, credentials: "same-origin" });
            const sponsor = await sponsor_res.json();

            const sponsor_id = parseInt(sponsor.id)
            

            const url = window.location.origin + `/api/campaign`;
            const res = await fetch(url, {
                method: "POST",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({name: this.form.name, description: this.form.description, category: this.form.category, budget: budget, goals: this.form.goals, sponsor_id: sponsor.id, duration: this.form.duration,}),
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
            this.form.description = ''
            this.form.category = ''
            this.form.budget = ''
            this.form.goals = ''
            this.form.duration = ''
        }
    }

}

export default AddCampaign;