import { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import LoginLink from "../../components/Login/Login.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <LoginLink/>
  );
}
