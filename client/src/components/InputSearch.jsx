import axios from "axios";
import { useEffect, useState } from "react";
function InputSearch() {
  const [totalData, setTotalData] = useState([]);
  //   const client = axios.create({
  //     baseURL: "http://localhost:3000/api/v1/list",
  //   });
  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/users/list").then((response) => {
      setTotalData(response.data.data.data);
    });
  }, []);
  console.log(totalData);

  const handleChange = (event) => {
    console.log(event.target.value);
    const filteredRes = totalData.filter((el) =>
      el.phone.includes(event.target.value)
    );
    setTotalData(filteredRes);
  };
  return (
    <>
      <label htmlFor="">Search</label>
      <input
        type="search"
        palceholder="search "
        required
        onChange={handleChange}
      />
      <div>
        <ul>
          {totalData.map(({ _id, phone }) => (
            <li key={_id}>{phone}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default InputSearch;
