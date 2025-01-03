const EditProfileAdmin = {
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
                    <label for="password" class="form-label">Change Password</label>
                    <input type="text" class="form-control" id="name" v-model="form.password">
                </div>

                <button type="submit" class="btn btn-primary mb-3">Submit</button>
            </form>

        </div>
    `,

    data() {
        return {
          form: {
            password: null
          },
          response_success: null,
          response_failure: null
        };
    },

    methods: {
        async submitInfo(){
            // console.log("MMMMMMM", this.form.password)
            const url = window.location.origin + `/api/user/` + this.$store.state.id;
            const res = await fetch(url, {
                method: "PUT",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({password: this.form.password}),
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

            this.form.password = ''
        }
    }

}

export default EditProfileAdmin;