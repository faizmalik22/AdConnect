const ProfileInfluencer = {
    template:`
        <div>
            
            <h1> INFLUENCER PROFILE </h1>

            <div class="mt-5">
                <img :src="image_url + 'influencer.png'" height="300px" class="rounded float-start view-campaign-image" alt="...">

                <div>
                    <h2>Name: {{influencer.name}}</h2>
                    <div class="campaign-info">
                        <p>Category : {{influencer.category}} </p>                        
                        <p>Niche : {{influencer.niche}} </p>                        
                        <p>Reach : {{influencer.reach}} </p>                        
                    </div>
                    <router-link to='/edit-influencer' class="btn btn-primary"> Edit </router-link>
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
            influencer: {}
        }
    },

    async mounted(){
        this.getInfluencer()
    },

    methods: {
        async getInfluencer() {
            const url = window.location.origin + `/api/influencer/` + this.$store.state.influencer_id;
            const res = await fetch(url, {
                method: "GET",
                headers: {'Authentication-Token': sessionStorage.getItem('token'), "Content-Type": "application/json"},
                credentials: "same-origin"
            });
    
            if (res.ok){
                const data = await res.json();
                this.influencer = data
                console.log(data);
            } else{
                console.error("Failed to Get Influencer:", res);
            }

        },
    }
    


}

export default ProfileInfluencer;