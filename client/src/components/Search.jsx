import { useSelector } from "react-redux";
import axios from "axios";
import { selectCurrentUser } from "../store/user/user.selector";
import InputSearch from "./InputSearch";
import { useEffect, useState } from "react";
function Search() {
  const user = useSelector(selectCurrentUser);
  const client = axios.create({
    baseURL: "http://localhost:3000/api/v1/users/auth",
  });

  const [authRequire, setAuthRequired] = useState(false);
  const token = localStorage.getItem("token");
  console.log(token, "token");
  useEffect(() => {
    client.post("", { token: token }).then((response) => {
      console.log(response.data.data);
      setAuthRequired(response.data.data);
    });
  }, []);

  console.log(user);
  return <div className="search-bar">{authRequire ? <InputSearch /> : ""}</div>;
}

export default Search;
