import axios from "axios";
import Input from "./Input";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/user/user.action";
const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logInUser = (event) => {
    event.preventDefault();
    const data = event.target;
    const phone = data[0].value;
    const password = data[1].value;

    var myHeaders = new Headers();
    myHeaders.append("apikey", "QOzqA6DX60hFh66X2EPlU09B5VFQ9dLL");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };
    fetch(
      `https://api.apilayer.com/number_verification/validate?number=${phone}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const client = axios.create({
          baseURL: "http://localhost:3000/api/v1/users/login",
        });

        client
          .post("", {
            phone,
            password,
          })
          .then((response) => {
            if (response.data.status === "success") {
              localStorage.setItem("token", response.data.token);
              console.log(response.data.token);
              dispatch(setCurrentUser(response.data));
              navigate("/search");
            }
            if (response.data.status === "fail") {
              navigate("/");
            }
          });
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <form action="#" onSubmit={logInUser}>
      <Input type="phone" palceholder="Email or Phone" />
      <Input type="password" palceholder="Password" />
      <SignUp />
    </form>
  );
};
export default Form;
