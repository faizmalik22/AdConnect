const UsersAdmin = {
    template: `
        <div>

            <h1>Sponsor Requests</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Role</th>

                            <th scope="col">Flag</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in inactive_sponsors">
                            <th scope="row">{{index + 1}}</th>
                            <td v-if="!user.active">{{user.email}}</td>
                            <td v-if="!user.active">Inactive</td>
                            <td v-if="!user.active">{{user.roles[0]}}</td>

                            <td><button type="button" @click=flagUser(user.id) class="btn btn-warning">Flag</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h1>Active Users</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Role</th>

                            <th scope="col">Flag</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in active_users">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{user.email}}</td>
                            <td v-if="user.active">Active</td>
                            <td v-if="!user.active">Inactive</td>
                            <td>{{user.roles[0]}}</td>

                            <td><button type="button" @click=flagUser(user.id) class="btn btn-warning">Flag</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>




            <h1>Inactive Users </h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Role</th>

                            <th scope="col">Flag</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in inactive_users">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{user.email}}</td>
                            <td v-if="user.active">Active</td>
                            <td v-if="!user.active">Inactive</td>
                            <td>{{user.roles[0]}}</td>

                            <td><button type="button" @click=flagUser(user.id) class="btn btn-warning">Flag</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>




        </div>
    `,

    data() {
        return {
            users: [],
            inactive_sponsors: [],
            active_users: [],
            inactive_users: [],
        }
    },

    async mounted(){
        this.getInactiveSponsors()
        this.getActiveUsers()
        this.getInactiveUsers()

    },

    methods: {
        async getUsers() {
            const url = window.location.origin + `/api/users`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.users = data
                console.log(data);
            } else{
                console.error("Failed to Get Users:", res);
                const data = await res.json();
                console.log(data.message);
            }

        },

        async getInactiveSponsors() {
            const url = window.location.origin + `/api/inactive_sponsors`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.inactive_sponsors = data
                console.log(data);
            } else{
                console.error("Failed to Get Inactive Sponsors:", res);
                const data = await res.json();
                console.log(data.message);
            }

        },

        async getActiveUsers() {
            const url = window.location.origin + `/api/active_users`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.active_users = data
                console.log(data);
            } else{
                console.error("Failed to Get Active Users:", res);
                const data = await res.json();
                console.log(data.message);
            }

        },

        async getInactiveUsers() {
            const url = window.location.origin + `/api/inactive_users`;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.inactive_users = data
                console.log(data);
            } else{
                console.error("Failed to Get Inactive Users:", res);
                const data = await res.json();
                console.log(data.message);
            }

        },

        async flagUser(user_id) {
            const url = window.location.origin + `/api/flaguser/` + user_id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });

            if (res.ok){
                const data = await res.json();
                console.log(data);
                this.getInactiveSponsors()
                this.getActiveUsers()
                this.getInactiveUsers()
            } else{
                console.error("Failed to Flag User:", res);
                const data = await res.json();
                console.log(data.message);
            }
        },
    }

}

export default UsersAdmin;