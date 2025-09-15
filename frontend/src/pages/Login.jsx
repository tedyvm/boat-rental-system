import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      login(res.data);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Prisijungimas nepavyko");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Prisijungimas</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">El. paštas</label>
            <input
              type="email"
              {...register("email", { required: "El. paštas privalomas" })}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Slaptažodis</label>
            <input
              type="password"
              {...register("password", { required: "Slaptažodis privalomas" })}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Prisijungti
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/register">Neturi paskyros? Registruokis</a>
        </div>
      </div>
    </div>
  );
}
