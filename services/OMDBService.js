import axios from 'axios';
import {
    HOST_URL
} from '../env';


const searchMovie = async(movieTitle, currentPage) => {
    let searchQuery = '';
    if (movieTitle) {
        searchQuery += `&s=${movieTitle}`;
    }
    const res = await axios.get(HOST_URL + searchQuery + `&page=${currentPage}`);
    // return movies;
    console.log(res.data);
    if (res.data['Response'] == "False") {
        return false;
    }
    return res.data;
}


module.exports = {
    searchMovie
};