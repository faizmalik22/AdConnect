const Home = {
    template: `
        <div>
            <h1>HOME PAGE</h1>
            <img :src="image_url" alt="" width="1210px" height="600px">
        </div>
    `,

    data(){
        return {
            image_url: '/static/images/1.jpg'
        }
    }

}

export default Home;