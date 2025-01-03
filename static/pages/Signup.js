const Signup = {
    template: `
        <div class="card shadow signup-card">
            <div v-if="response_success" class="alert alert-success text-center">
                {{ response_success }}
            </div>
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>


            <h1 class="mt-3 mb-4 text-center">Sign Up</h1>
            <form @submit.prevent="submitInfo">
                <div class="form-group mb-3">
                    <input v-model="name" type="text" class="form-control signup-input-height" placeholder="Name" required/>
                </div>
                <div class="form-group mb-3">
                    <input v-model="email" type="email" class="form-control signup-input-height" placeholder="Email" required/>
                </div>
                <div class="form-group mb-3">
                    <input v-model="password" type="password" class="form-control signup-input-height" placeholder="Password" required/>
                </div>
                <div class="form-group mb-5 ">
                    <select v-model="role" class="form-control signup-input-height">
                        <option value="influencer">Influencer</option>
                        <option value="sponsor">Sponsor</option>
                    </select>
                </div>
                <button class="btn btn-primary w-100 mt-3 signup-input-height" type="submit">Submit</button>
            </form>

        </div>
    `,

    data() {
        return {
            name: "",
            email: "",
            password: "",
            role: "influencer",
            response_success: null,
            response_failure: null
        };
    },

    methods: {
        async submitInfo(){
            const url = window.location.origin + `/register`;
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: this.name, email: this.email, password: this.password, role: this.role}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json()
                console.log(data);
                this.response_failure = null
                this.response_success = data.message
                // this.$router.push('/login')
            } else{
                console.error("Failed to Signup:", res);
                const data = await res.json();
                console.log(data);
                this.response_success = null
                this.response_failure = data.message
            }
        }
    }
};

export default Signup;