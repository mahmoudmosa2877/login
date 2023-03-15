function Input({ type, palceholder }) {
  return (
    <div className="row">
      <i className="fas fa-user"></i>
      <input type={type} palceholder={palceholder} required />
    </div>
  );
}

export default Input;
