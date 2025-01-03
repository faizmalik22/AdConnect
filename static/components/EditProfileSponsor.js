const EditProfileSponsor = {
    template: `
        <div id="form-body" class="card shadow">
            <div v-if="response_success" class="alert alert-success text-center">
                {{ response_success }}
            </div>
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>


            <h2 class="mt-3 mb-4 text-center">Edit Profile</h2>
            <form @submit.prevent="submitInfo">
                <div class="mb-3">
                    <label for="company_name" class="form-label">Company Name</label>
                    <input type="text" class="form-control" id="company_name" v-model="form.company_name">
                </div>

                <div class="mb-3">
                    <label for="industry" class="form-label">Industry</label>
                    <input type="text" class="form-control" id="industry" v-model="form.industry">
                </div>

                <div class="mb-3">
                    <label for="budget" class="form-label">Budget</label>
                    <input type="number" class="form-control" id="budget" v-model="form.budget">
                </div>

                <button type="submit" class="btn btn-primary mb-3">Submit</button>
            </form>
        </div>
    `,

    data() {
        return {
          form: {
            company_name: null,
            industry: null,
            budget: null
          },
          response_success: null,
          response_failure: null
        };
    },

    methods: {
        async submitInfo(){
            const url = window.location.origin + `/api/sponsor/` + this.$store.state.sponsor_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({company_name: this.form.company_name, industry: this.form.industry, budget: this.form.budget}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.response_success = data.message
            } else{
                console.error("Failed to Edit Profile:", res);
                const data = await res.json();
                console.log(data);
                this.response_failure = data.message
            }

            this.form.company_namename = ''
            this.form.industry = ''
            this.form.budget = ''
        }
    }

}

export default EditProfileSponsor;