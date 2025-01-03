const RequestsAdmin = {
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

        </div>
    `,

    data() {
        return {
            inactive_sponsors: [],
        }
    },

    async mounted(){
        this.getInactiveSponsors()

    },

    methods: {
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
            } else{
                console.error("Failed to Flag User:", res);
                const data = await res.json();
                console.log(data.message);
            }
        },
    }

}

export default RequestsAdmin;