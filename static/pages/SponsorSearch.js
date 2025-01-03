const SponsorSearch = {
    template:`
        <div>
            
            <h1>INFLUENCERS</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Influencer Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Niche</th>
                            <th scope="col">Reach</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in search_result">
                            <th scope="row">{{index + 1}}</th>
                            <td>{{user.name}}</td>
                            <td>{{user.category}}</td>
                            <td>{{user.niche}}</td>
                            <td>{{user.reach}}</td>
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

export default SponsorSearch;