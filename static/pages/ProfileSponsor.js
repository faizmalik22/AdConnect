const ProfileSponsor = {
    template:`
        <div>
            
            <h1> SPONSOR PROFILE </h1>

            <div class="mt-5">
                <img :src="image_url + 'sponsor.png'" height="300px" class="rounded float-start view-campaign-image" alt="...">

                <div>
                    <h2>Name: {{sponsor.company_name}}</h2>
                    <div class="campaign-info">
                        <p>Industry : {{sponsor.industry}} </p>                        
                        <p>Budget : {{sponsor.budget}} </p>                        
                    </div>
                    <router-link to='/edit-sponsor' class="btn btn-primary"> Edit </router-link>
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
            sponsor: {}
        }
    },

    async mounted(){
        this.getSponsor()
    },

    methods: {
        async getSponsor() {
            const url = window.location.origin + `/api/sponsor/` + this.$store.state.sponsor_id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.sponsor = data
                console.log(data);
            } else{
                console.error("Failed to Get Sponsor:", res);
            }

        },
    }
}

export default ProfileSponsor;