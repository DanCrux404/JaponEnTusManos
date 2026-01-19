import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/users";
import { loginAdmin } from "../../services/admin";
import "../../styles/Login.css";

function Login() {
    const [loginType, setLoginType] = useState("user");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            let data;
            if (loginType === "admin") {
                data = await loginAdmin({ Name: identifier, Password: password });
                navigate("/adminDashboard");
            } else {
                data = await loginUser({ Email: identifier, Password: password });
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/UserHome");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            <label>
                Tipo de login:
                <select value={loginType} onChange={e => setLoginType(e.target.value)}>
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                </select>
            </label>

            <form onSubmit={handleLogin}>
                <input
                    type={loginType === "admin" ? "text" : "email"}
                    placeholder={loginType === "admin" ? "Name" : "Email"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar sesión</button>
            </form>

            <p>
                ¿No tienes cuenta?{" "}
                <span
                    style={{ color: "#e60039", cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => navigate("/register")}
                >
                    Crear cuenta
                </span>
            </p>

        </div>

    );
}

export default Login;
