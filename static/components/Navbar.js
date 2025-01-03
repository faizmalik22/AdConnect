const Navbar = {
    template: `
        <div>
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid custom-navbar">

                    <router-link v-if="!state.loggedIn" to='/' class="navbar-brand"> AdConnect </router-link>
                    <router-link v-if="state.loggedIn && state.role === 'admin'" to='/home-admin' class="navbar-brand"> AdConnect </router-link>
                    <router-link v-if="state.loggedIn && state.role === 'sponsor'" to='/home-sponsor' class="navbar-brand"> AdConnect </router-link>
                    <router-link v-if="state.loggedIn && state.role === 'influencer'" to='/home-influencer' class="navbar-brand"> AdConnect </router-link>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <form v-if="state.loggedIn && state.role === 'admin'" @submit.prevent="adminSearch" class="d-flex" role="search">
                        <input v-model="search_query" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>

                    <form v-if="state.loggedIn && state.role === 'sponsor'" @submit.prevent="sponsorSearch" class="d-flex" role="search">
                        <input v-model="search_query" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>

                    <form v-if="state.loggedIn && state.role === 'influencer'" @submit.prevent="influencerSearch" class="d-flex" role="search">
                        <input v-model="search_query" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">

                            <li class="nav-item">
                                <router-link v-if="!state.loggedIn" to='/login' class="nav-link active" aria-current="page"> Login </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="!state.loggedIn" to='/signup' class="nav-link active" aria-current="page"> Signup </router-link>
                            </li>



                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'admin'" to='/dashboard-admin' class="nav-link active" aria-current="page"> Campaigns </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'sponsor'" to='/dashboard-sponsor' class="nav-link active" aria-current="page"> Campaigns </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'influencer'" to='/dashboard-influencer' class="nav-link active" aria-current="page"> Campaigns </router-link>
                            </li>





                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'admin'" to='/users' class="nav-link active" aria-current="page"> Users </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'sponsor'" to='/active-influencers' class="nav-link active" aria-current="page"> Influencers </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'sponsor'" to='/requests-sponsor' class="nav-link active" aria-current="page"> Requests </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'influencer'" to='/requests-influencer' class="nav-link active" aria-current="page"> Requests </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'admin'" to='/adrequests-admin' class="nav-link active" aria-current="page"> Ad History </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'sponsor'" to='/adrequests-sponsor' class="nav-link active" aria-current="page"> Ad History </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'influencer'" to='/adrequests-influencer' class="nav-link active" aria-current="page"> Ad History </router-link>
                            </li>

                            <li class="nav-item">
                                <router-link v-if="state.loggedIn && state.role === 'admin'" to='/profile-admin' class="nav-link active" aria-current="page"> Admin </router-link>
                                <router-link v-if="state.loggedIn && state.role === 'sponsor'" to='/profile-sponsor' class="nav-link active" aria-current="page"> Sponsor </router-link>
                                <router-link v-if="state.loggedIn && state.role === 'influencer'" to='/profile-influencer' class="nav-link active" aria-current="page"> Influencer </router-link>
                            </li>

                            <li class="nav-item">
                                <button v-if="state.loggedIn" @click="logout" class="nav-link active" aria-current="page"> Logout </button>
                            </li>

                        </ul>
                    </div>

                </div>
            </nav>
        </div>
    `,

    data() {
        return {
            search_query: null,
            search_result: null
        };
    },

    computed: {
        state(){
          return this.$store.state
        }
    },

    methods: {
        logout() {
            sessionStorage.clear();
    
            this.$store.commit('logout');
    
            this.$router.push("/");
        },

        async adminSearch(){
            const url = window.location.origin + `/api/admin_search`;
            const res = await fetch(url, {
                method: "POST",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({search_query: this.search_query}),
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.search_result = data
            } else{
                console.error("Failed to Search:", res);
                const data = await res.json();
                console.log(data);
            }
    
    
            this.search_query = ''
            this.$router.push({ name: 'admin-search', params: { search_result: this.search_result }, query: { refresh: new Date().getTime() } });
    
        },


        async sponsorSearch(){
            const url = window.location.origin + `/api/sponsor_search`;
            const res = await fetch(url, {
                method: "POST",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({search_query: this.search_query}),
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.search_result = data
            } else{
                console.error("Failed to Search:", res);
                const data = await res.json();
                console.log(data);
            }
    
    
            this.search_query = ''
            this.$router.push({ name: 'sponsor-search', params: { search_result: this.search_result }, query: { refresh: new Date().getTime() } });
    
        },


        async influencerSearch(){
            const url = window.location.origin + `/api/influencer_search`;
            const res = await fetch(url, {
                method: "POST",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                body: JSON.stringify({search_query: this.search_query}),
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.search_result = data
            } else{
                console.error("Failed to Search:", res);
                const data = await res.json();
                console.log(data);
            }
    
    
            this.search_query = ''
            this.$router.push({ name: 'influencer-search', params: { search_result: this.search_result }, query: { refresh: new Date().getTime() } });
    
        }

    },
}

export default Navbar;
