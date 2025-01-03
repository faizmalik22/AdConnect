const ProfileAdmin = {
    template:`
        <div>
            
            <h1> ADMIN PROFILE </h1>

            <div class="mt-5">
                <img :src="image_url + 'admin.png'" height="300px" class="rounded float-start view-campaign-image" alt="...">

                <div>
                    <h2>Admin</h2>
                    <div class="campaign-info">
                        <p>Email : {{admin.email}} </p>                        
                    </div>
                    <router-link to='/edit-admin' class="btn btn-primary"> Edit </router-link>
                </div>

                <div class="view-campaign-clear">
                    <h2></h2>
                </div>
                
            </div>



            

        </div>
    `,
    
    data() {
        return {
            image_url: '/static/images/',
            admin: {}
        }
    },

    async mounted(){
        this.getAdmin()
    },

    methods: {
        async getAdmin() {
            const url = window.location.origin + `/api/user/` + this.$store.state.id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.admin = data
                console.log(data);
            } else{
                console.error("Failed to Get Admin:", res);
            }

        },
    }

}

export default ProfileAdmin;