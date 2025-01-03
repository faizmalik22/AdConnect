const store = new Vuex.Store({
    state: {
        loggedIn: JSON.parse(sessionStorage.getItem('loggedIn')) || false,
        role: sessionStorage.getItem('role') || "",
        id: sessionStorage.getItem('id') || null,
        sponsor_id: sessionStorage.getItem('sponsor_id') || null,
        influencer_id: sessionStorage.getItem('influencer_id') || null,
        search_query: null,
        search_result: []
    },

    mutations: {
        setLogin(state, data){
            state.loggedIn = true
            state.role = data.role
            state.id = data.id
        },
        logout(state){
            state.loggedIn = false
            state.role = ""
        },
        setSponsorId(state, data){
            state.sponsor_id = data.sponsor_id
        },
        setInfluencerId(state, data){
            state.influencer_id = data.influencer_id
        },
        setSearchQuery(state, data){
            state.search_query = data.search_query
        },
        setSearchResult(state, data){
            state.search_result = data.search_result
        }
    }
    
})

export default store;