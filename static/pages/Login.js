const Login = {
    template: `
        <div class="card shadow login-card">
            <div v-if="response_failure" class="alert alert-danger text-center">
                {{ response_failure }}
            </div>

            
            <h1 class="mt-3 mb-4 text-center">Login</h1>
            <form @submit.prevent="submitInfo">
                <div class="form-group mb-3">
                    <input v-model="email" type="email" class="form-control login-input-height" placeholder="Email" required />
                </div>
                <div class="form-group mb-5">
                    <input v-model="password" type="password" class="form-control login-input-height" placeholder="Password" required />
                </div>
                <button class="btn btn-primary w-100 mb-3 login-input-height" type="submit">Submit</button>
            </form>

        </div>   
    `,

    data() {
        return {
            email: "",
            password: "",
            response_failure: null
        };
    },

    methods: {
        async submitInfo(){
            const url = window.location.origin + `/userlogin`;
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: this.email, password: this.password}),
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);

                sessionStorage.setItem('token', data.token)
                sessionStorage.setItem('role', data.role)
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('id', data.id)
                sessionStorage.setItem('loggedIn', true)

                this.$store.commit('setLogin', { role: data.role, id: data.id })

                switch (data.role) {
                    case "admin":
                        this.$router.push("/home-admin");
                        break;
                    case "sponsor":
                        sessionStorage.setItem('sponsor_id', data.sponsor_id)
                        this.$store.commit('setSponsorId', { sponsor_id: data.sponsor_id })
                        this.$router.push("/home-sponsor");
                        break;
                    case "influencer":
                        sessionStorage.setItem('influencer_id', data.influencer_id)
                        this.$store.commit('setInfluencerId', { influencer_id: data.influencer_id })
                        this.$router.push("/home-influencer");
                }

            } else{
                console.error("Failed to Login:", res);
                const data = await res.json();
                console.log(data);
                this.response_failure = data.message
            }
        }
    }


};

export default Login