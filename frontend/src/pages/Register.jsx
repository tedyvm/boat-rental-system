import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      await axios.post("http://localhost:5000/api/auth/register", data);
      navigate("/login"); // redirect po sėkmingos registracijos
    } catch (err) {
      setServerError(err.response?.data?.message || "Registracija nepavyko");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Registracija</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Vartotojo vardas</label>
            <input
              type="text"
              {...register("username", { required: "Vartotojo vardas privalomas" })}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">El. paštas</label>
            <input
              type="email"
              {...register("email", { required: "El. paštas privalomas" })}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Slaptažodis</label>
            <input
              type="password"
              {...register("password", { required: "Slaptažodis privalomas" })}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Pakartoti slaptažodį</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Pakartoti slaptažodį privaloma",
                validate: (val) => val === watch("password") || "Slaptažodžiai nesutampa",
              })}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Registruotis
          </button>
        </form>
      </div>
    </div>
  );
}
