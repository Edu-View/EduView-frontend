import axios from "axios";
export default axios.create({
    baseURL: "http://localhost:3500"
    /* baseURL: "https://eduview-backend.onrender.com" */
});