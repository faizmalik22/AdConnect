const AdminSearch = {
    template:`
        <div>
            
            <h1>Users</h1>
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
                        <tr v-for="(user, index) in search_result">
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
    
    props: {
        search_result: Array
    },

    
}

export default AdminSearch;