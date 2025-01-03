const EditProfileInfluencer = {
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
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" v-model="form.name">
                </div>

                <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <input type="text" class="form-control" id="category" v-model="form.category">
                </div>

                <div class="mb-3">
                    <label for="niche" class="form-label">Niche</label>
                    <input type="text" class="form-control" id="niche" v-model="form.niche">
                </div>

                <div class="mb-3">
                    <label for="reach" class="form-label">Reach</label>
                    <input type="number" class="form-control" id="reach" v-model="form.reach">
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
            niche: null,
            reach: null
          },
          response_success: null,
          response_failure: null
        };
    },


    methods: {
        async submitInfo(){
            const url = window.location.origin + `/api/influencer/` + this.$store.state.influencer_id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({name: this.form.name, category: this.form.category, niche: this.form.niche, reach: this.form.reach}),
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

            this.form.name = ''
            this.form.category = ''
            this.form.niche = ''
            this.form.reach = ''
        }
    }

}

export default EditProfileInfluencer;